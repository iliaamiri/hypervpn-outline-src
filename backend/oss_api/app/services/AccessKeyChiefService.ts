import {IManualServer} from "../interfaces/ManualServer/IManualServer";

import database from "../../databaseAccessLayer";
import {AccessKey} from "../models/AccessKey";

const AccessKeyChiefService = {
  async SyncAccessKeysBetweenShadowboxAndDatabase(server: IManualServer) {
    console.debug(`Syncing Access Keys between Shadowbox and the Database for server with management api url of: ${server.getManagementApiUrl()}`);
    
    const listOfAccessKeysInShadowbox = await server.listAccessKeys();
    
    for (let accessKeyInShadowbox of listOfAccessKeysInShadowbox) {
      const foundAccessKeyInDatabase = await database.accessKeyEntity.findByKeyIdAndServerRowId(accessKeyInShadowbox.id, server.rowId);
      
      if (!foundAccessKeyInDatabase) {
        console.log(`An Access Key was not synced. Start syncing...`);
        
        const accessKeyInstance = new AccessKey(server, accessKeyInShadowbox.name, accessKeyInShadowbox.dataLimit);
        
        accessKeyInstance.id = accessKeyInShadowbox.id;
        accessKeyInstance.accessUrl = accessKeyInShadowbox?.accessUrl;
        accessKeyInstance.method = accessKeyInShadowbox?.method;
        accessKeyInstance.password = accessKeyInShadowbox?.password;
        accessKeyInstance.port = accessKeyInShadowbox?.port;
        accessKeyInstance.createdAt = accessKeyInstance.server.getCreatedDate()?.getMilliseconds();
        
        accessKeyInstance.saveToDb()
          .then(() => console.log(`Synced ✅`))
          .catch(err => console.error(`FAILED ❌! Reason: `, err));
      }
    }
  }
};

export default AccessKeyChiefService;