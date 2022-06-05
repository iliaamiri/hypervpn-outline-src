import IManualServerId from "../interfaces/ManualServer/IManualServerId";
import IBandwidthThreshold from "../interfaces/ManualServer/IBandwidthThreshold";
import IDataLimit from "../interfaces/AccessKey/IDataLimit";

export default interface IManualServerDto {
  rowId: number;
  manualServerId?: IManualServerId;
  managementApiUrl: string;
  name: string;
  host: string;
  bandwidthThreshold?: IBandwidthThreshold;
  portForNewAccessKeys: number;
  defaultDataLimit?: IDataLimit;
  isMetricsEnabled: boolean;
  shadowboxVersion?: string;
}