export interface IManualServerEntity {
  id: number;
  manualServerId: string;
  name: string;
  shadowboxVersion: string;
  defaultDataLimit;
  metricsEnabled;
  hostnameForAccessKeys: string;
  managementApiUrl: string;
  certSha256: string;
  portForNewAccessKeys
  createdAt: number;
}