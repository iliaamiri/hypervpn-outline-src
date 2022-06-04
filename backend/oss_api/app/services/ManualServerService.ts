import ManualServerRepository from "./ManualServerRepository";
import ManualServerExceptions from "../../core/exceptions/ManualServerExceptions";

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
  
  async GetAll() {
    return await ManualServerRepository.listServers();
  },
};

export default ManualServerService;