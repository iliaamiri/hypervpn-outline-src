import {DataLimit} from "../IAccessKey";

export default interface IManualServerJSON {
  name: string;
  shadowboxVersion: string;
  defaultDataLimit: DataLimit;
  metricsEnabled: boolean;
  hostnameForAccessKeys: string;
  managementApiUrl: string;
  portForNewAccessKeys: number;
  createdAt: Date;
}