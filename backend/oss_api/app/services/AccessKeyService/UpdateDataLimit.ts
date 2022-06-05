import IDataLimit from "../../interfaces/AccessKey/IDataLimit";
import {AccessKey} from "../../models/AccessKey";
import ManualServerExceptions from "../../../core/exceptions/ManualServerExceptions";

export default async function UpdateDataLimit(accessKey: AccessKey, dataLimit: IDataLimit) {
  accessKey.dataLimit = dataLimit;
  
  // Check if the server is still reachable or not
  let isServerHealthy = await accessKey.server.isHealthy();
  if (!isServerHealthy) {
    throw ManualServerExceptions.SERVER_IS_NOT_HEALTHY;
  }
  
  if (!accessKey.server.getMetricsEnabled()) {
    throw ManualServerExceptions.METRICS_IS_DISABLED;
  }
  
  return await accessKey.server.setAccessKeyDataLimit(accessKey.id, accessKey.dataLimit);
}