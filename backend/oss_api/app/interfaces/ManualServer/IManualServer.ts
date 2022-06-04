import { IServer } from '../IServer';

// Manual servers are servers which the user has independently setup to run
// shadowbox, and can be on any cloud provider.
export interface IManualServer extends IServer {
  rowId?: number;
  
  manualServerId: string;
  
  isCertificateTrusted: boolean;
  
  certSha256: string;

  bandwidthThreshold: IBandwidthThreshold;

  getCertificateFingerprint(): string;

  forget(): void;
  
  saveToDatabase(): void;
}

// Configuration for manual servers.  This is the output emitted from the
// shadowbox install script, which is needed for the manager connect to
// shadowbox.
export interface ManualServerConfig {
  apiUrl: string;
  certSha256: string;
}

// Repository of ManualServer objects.  These are servers the user has setup
// themselves, and configured to run shadowbox, outside of the manager.
export interface IManualServerRepository {
  // Lists all existing Shadowboxes.
  listServers(): Promise<IManualServer[]>;
  // Adds a manual server using the config (e.g. user input).
  addServer(config: ManualServerConfig): Promise<IManualServer>;
  // Retrieves a server with `config`.
  findServer(config: ManualServerConfig): IManualServer | undefined;
}

export interface IBandwidthThreshold {
  megaBytes: number
}