import {IServer} from '../Server/IServer';
import IBandwidthThreshold from "./IBandwidthThreshold";
import IManualServerDto from "../../models/IManualServerDto";

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
  
  toJSON(): IManualServerDto;
}

