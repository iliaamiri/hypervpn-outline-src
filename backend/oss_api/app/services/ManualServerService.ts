import ManualServerRepository from "./ManualServerRepository";
import ManualServerExceptions from "../../core/exceptions/ManualServerExceptions";
import database from "../../databaseAccessLayer";
import * as entityInterfaces from "../../databaseAccessLayer/sql/IManualServerEntity";
import IManualServerDto from "../models/IManualServerDto";
import manualServerRepository from "./ManualServerRepository";
import {IManualServer} from "../interfaces/ManualServer/IManualServer";

const ManualServerService = {
  async AddServers(servers) {
    
    const errors = [];
    for (const serverConfig of servers) {
      try {
        // Check if the server already exists in the repo (memory) or the database.
        const existingServer = await ManualServerRepository.fetchServer(serverConfig);
        if (existingServer) {
          console.debug('server already added');
          throw new Error(ManualServerExceptions.SERVER_WAS_ALREADY_ADDED.errName);
        }
        
        // Add to Repository (Memory)
        const newManualServer = await ManualServerRepository.addServer(serverConfig);
        
        // Add to Database
        newManualServer.saveToDatabase();
      } catch (error) {
        console.log("SERVICE ERROR: ", error);
        errors.push(error);
      }
    }
    
    return errors;
  },
  
  async GetAll(): Promise<IManualServer[]> {
    return await ManualServerRepository.listServers();
  },
  
  async FindById(manualServerRowId: number): Promise<IManualServer | null> {
    const foundServer: entityInterfaces.IManualServerEntity = await database.manualServerEntity.findByRowId(manualServerRowId);
    if (!foundServer) {
      return null;
    }
    
    const foundServerConfig = {
      apiUrl: foundServer.managementApiUrl,
      certSha256: foundServer.certSha256
    }
    
    // TODO: this is risky because if the server wouldn't exist in the memory, the source would have to query the sql
    // again and that's a bad practice because it's an necessary load.
    // The only pro this has is that if the server was not in the memory, after querying it, will be added.
    const fetchedServer: IManualServer = await manualServerRepository.fetchServer(foundServerConfig, {
      megaBytes: foundServer.bandwidthThreshold
    });
    
    return fetchedServer;
  },
  
  async UpdateManualServer(server: IManualServer, givenServer: IManualServerDto) {
    await server.getServerConfig();
    
    // Enable/Disable metrics
    await server.setMetricsEnabled(givenServer.isMetricsEnabled);
    
    // Update bandwidth threshold
    server.bandwidthThreshold = givenServer.bandwidthThreshold;
    
    // Update default dataLimit
    await server.setDefaultDataLimit(givenServer.defaultDataLimit);
    
    // Update name
    await server.setName(givenServer.name);
    
    // Update host
    const hostname = givenServer.host.split(":")[0];
    await server.setHostnameForAccessKeys(hostname);
    
    // Update port
    await server.setPortForNewAccessKeys(givenServer.portForNewAccessKeys);
    
    server.saveToDatabase();
  },
  
  async ForgetServer(server: IManualServer) {
    if (server.rowId === undefined) {
      return false;
    }
    
    await database.manualServerEntity.deleteByRowId(server.rowId);
    
    server.forget();
    
    return true;
  },
};

export default ManualServerService;