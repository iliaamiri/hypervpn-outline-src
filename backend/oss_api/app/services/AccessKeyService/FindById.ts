import {AccessKey} from "../../models/AccessKey";
import {DataLimit} from "../../interfaces/IAccessKey";
import database from "../../../databaseAccessLayer";

export default async function FindById(keyId) {
  const foundAccessKey = await database.accessKeyEntity.findByRowId(keyId);
  
  if (!foundAccessKey) {
    return null;
  }
  
  let dataLimit = { bytes: foundAccessKey.dataLimit } as DataLimit;
  
  let accessKeyInstance = new AccessKey(null, foundAccessKey.accessUrl, dataLimit);
  accessKeyInstance.rowId = foundAccessKey.id;
  accessKeyInstance.id = foundAccessKey.keyId;
  
  return accessKeyInstance;
}