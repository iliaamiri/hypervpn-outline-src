import IDataLimit from "../AccessKey/IDataLimit";

export default interface IManualServerJSON {
  name: string;
  shadowboxVersion: string;
  defaultDataLimit: IDataLimit;
  metricsEnabled: boolean;
  hostnameForAccessKeys: string;
  managementApiUrl: string;
  portForNewAccessKeys: number;
  createdAt: Date;
}