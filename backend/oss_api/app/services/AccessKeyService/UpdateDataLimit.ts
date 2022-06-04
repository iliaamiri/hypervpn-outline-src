import {DataLimit} from "../../interfaces/IAccessKey";
import {AccessKey} from "../../models/AccessKey";
import ManualServerExceptions from "../../../core/exceptions/ManualServerExceptions";

export default async function UpdateDataLimit(accessKey: AccessKey, dataLimit: DataLimit) {
  accessKey.dataLimit = dataLimit;
  
  // Check if the server is still reachable or not
  let isServerHealthy = await accessKey.server.isHealthy();
  if (!isServerHealthy) {
    throw ManualServerExceptions.SERVER_IS_NOT_HEALTHY;
  }
  
  return await accessKey.server.setAccessKeyDataLimit(accessKey.id, accessKey.dataLimit);
}