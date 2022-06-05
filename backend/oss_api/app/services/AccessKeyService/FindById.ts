import {AccessKey} from "../../models/AccessKey";
import IDataLimit from "../../interfaces/AccessKey/IDataLimit";
import database from "../../../databaseAccessLayer";

export default async function FindById(keyId): Promise<AccessKey | null> {
  const foundAccessKey = await database.accessKeyEntity.findByRowId(keyId);
  
  if (!foundAccessKey) {
    return null;
  }
  
  let dataLimit = { bytes: foundAccessKey.dataLimit } as IDataLimit;
  
  let accessKeyInstance = new AccessKey(null, foundAccessKey.accessUrl, dataLimit);
  accessKeyInstance.rowId = foundAccessKey.id;
  accessKeyInstance.id = foundAccessKey.keyId;
  accessKeyInstance.serverRowId = foundAccessKey.serverRowId;
  
  return accessKeyInstance;
}