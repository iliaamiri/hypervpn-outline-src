export interface IManualServerEntity {
  id: number;
  manualServerId: string;
  name: string;
  shadowboxVersion: string;
  defaultDataLimit;
  bandwidthThreshold: number;
  metricsEnabled;
  hostnameForAccessKeys: string;
  managementApiUrl: string;
  certSha256: string;
  portForNewAccessKeys
  createdAt: number;
}