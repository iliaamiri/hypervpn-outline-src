import {AccessKey} from "../../models/AccessKey";


export default async function CreateNewKey(instance : AccessKey) : Promise<AccessKey> {
  const keyValue = await instance.server.addAccessKey();
  
  console.log("keyValue: ", keyValue);
  
  instance.id = keyValue.id;
  
  if (instance.name && instance.name.length > 0) {
    instance.server.setName(instance.name);
  }
  if (instance.dataLimit && !isNaN(instance.dataLimit.bytes) && instance.dataLimit.bytes > 0) {
    instance.server.setAccessKeyDataLimit(keyValue.id, instance.dataLimit);
  }
  if (keyValue.accessUrl) {
    instance.accessUrl = keyValue.accessUrl;
  }
  if (keyValue.password !== undefined) {
    instance.password = keyValue.password;
  }
  if (keyValue.port !== undefined) {
    instance.port = keyValue.port;
  }
  if (keyValue.method !== undefined) {
    instance.method = keyValue.method;
  }
  
  instance.createdAt = Date.now();
  
  await instance.saveToDb();
  
  return instance;
}