import IDataLimit from "../AccessKey/IDataLimit";

export default interface ServerConfigJSON {
  name: string;
  metricsEnabled: boolean;
  serverId: string;
  createdTimestampMs: number;
  portForNewAccessKeys: number;
  hostnameForAccessKeys: string;
  version: string;
  // This is the server default data limit.  We use this instead of defaultDataLimit for API
  // backwards compatibility.
  accessKeyDataLimit?: IDataLimit;
}