import {IManualServer} from "../interfaces/ManualServer/IManualServer";

// Models
import ManualServer from "../models/ManualServer";

// Database
import database from '../../databaseAccessLayer';
import ManualServerExceptions from "../../core/exceptions/ManualServerExceptions";
import AccessKeyChiefService from "./AccessKeyChiefService";
import IManualServerConfig from "../interfaces/ManualServer/IManualServerConfig";
import IBandwidthThreshold from "../interfaces/ManualServer/IBandwidthThreshold";

class ManualServers {
  // A collection of all the servers.
  public servers: IManualServer[] = [];
  
  /**
   * AKA. "Not Healthy Servers"
   * A bad server is a server that recently could not be reached or get connected to.
   */
  private badServers: IManualServer[] = [];
  
  constructor() {}
  
  static instantiated = false;
  static async getSingleton() {
    if (ManualServers.instantiated) {
      return;
    }
    
    const instance = new ManualServers();
    await instance.loadServers();
    
    console.debug(`Currently there are ${instance.servers.length} servers in the database.`);
    console.debug(`Servers: `, instance.servers);
    
    setInterval(async () => {
      const allManualServers = (await instance.listServers())
        .filter(_server => _server.isCertificateTrusted);
      
      const healthyManualServers = [];
      for (let server of allManualServers) {
        if (await server.isHealthy()) {
          healthyManualServers.push(server);
        }
      }
    
      for (let healthyServer of healthyManualServers) {
        if (healthyServer['serverConfig']) {
          await healthyServer.saveToDatabase();
        }
      }
    },10 * 15 * 1000);
  
    setInterval(async () => {
      console.debug("Inspecting the servers...");
      await instance.inspectServers();
      console.log("The list of bad servers is updated: ", instance.badServers);
    }, 15 * 60 * 1000);
  

    for (let server of instance.servers) {
      AccessKeyChiefService.SyncAccessKeysBetweenShadowboxAndDatabase(server);
    }
    
    ManualServers.instantiated = true;
    return instance;
  }
  
  async listServers(): Promise<IManualServer[]> {
    // for (let index in this.servers) {
    //   await this.servers[index].getServerConfig();
    // }
    return this.servers;
  }
  
  private async loadServers(): Promise<void> {
    const fetchedServers = await database.manualServerEntity.findAll();
    if (!fetchedServers) {
      this.servers = [];
      return;
    }
  
    try {
      this.servers = fetchedServers.map(resultRow => {
        const serverInstance = this.instantiateServer({
          apiUrl: resultRow.managementApiUrl,
          certSha256: resultRow.certSha256
        });
        serverInstance.rowId = resultRow.id;
        return serverInstance;
      });
    } catch (e) {
      console.debug("Servers result rows from SQL: ", fetchedServers);
      console.error('Error creating manual servers from database', e);
    }
  }
  
  // Detects the bad (unhealthy) servers and recollect them in the `badServers` collection.
  private async inspectServers(): Promise<IManualServer[]> {
    const newBadServers: IManualServer[] = [];
    for (const index in this.servers) {
      let server = this.servers[index];
      const isServerHealthy = await server.isHealthy();
      if (!isServerHealthy) {
        // Sieve the bad server from the rest healthy ones.
        this.servers.splice(Number(index), 1);
        newBadServers.push(server);
      }
    }
    this.badServers = this.badServers.concat(newBadServers);
    return newBadServers;
  }
  
  public async addServer(config: IManualServerConfig, bandwidthThreshold?: IBandwidthThreshold): Promise<IManualServer> {
    // Instantiate a new Server
    const server = this.instantiateServer(config);
  
    // Check if the server is reachable or not.
    const isHealthy = await server.isHealthy();
    if (!isHealthy) {
      throw new Error(ManualServerExceptions.SERVER_IS_NOT_HEALTHY.errName);
    }
    
    if (bandwidthThreshold) {
      server.bandwidthThreshold = bandwidthThreshold;
    }
  
    AccessKeyChiefService.SyncAccessKeysBetweenShadowboxAndDatabase(server);
    
    // If server was healthy, push it to the memory.
    this.servers.push(server);

    return (server);
  }
  
  public findServerFromRepo(config: IManualServerConfig): IManualServer | undefined {
    return this.servers.find((server) => server.getManagementApiUrl() === config.apiUrl);
  }
  
  private static async findServerFromDatabase(config: IManualServerConfig) {
    const foundServer = await database.manualServerEntity.findByManagementApiUrl(config.apiUrl);
    return (foundServer) ? foundServer : null;
  }
  
  public async fetchServer(config: IManualServerConfig, bandwidthThreshold?: IBandwidthThreshold): Promise<IManualServer | null> {
    const foundServerFromRepo = this.findServerFromRepo(config);
    if (foundServerFromRepo) {
      console.log("FOUND SERVER FROM REPO");
      return foundServerFromRepo;
    }
    
    const foundServerFromDatabase = await ManualServers.findServerFromDatabase(config);
    if (foundServerFromDatabase) {
      console.log("FOUND SERVER FROM DB");
      return await this.addServer({
        apiUrl: foundServerFromDatabase.managementApiUrl,
        certSha256: foundServerFromDatabase.certSha256
      }, bandwidthThreshold);
    }
    
    return null;
  }
  
  private instantiateServer(config: IManualServerConfig) {
    const server = new ManualServer(`manual:${config.apiUrl}`, config, () => {
      this.forgetServer(server);
    });
    return server;
  }
  
  private forgetServer(serverToForget: IManualServer): void {
    const apiUrl = serverToForget.getManagementApiUrl();
    this.servers = this.servers.filter((server) => {
      return apiUrl !== server.getManagementApiUrl();
    });
  }
}

const ManualServerRepository = await ManualServers.getSingleton();
export default ManualServerRepository;