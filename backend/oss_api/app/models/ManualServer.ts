import {
  IManualServer,
  
} from '../interfaces/ManualServer/IManualServer';
import IBandwidthThreshold from "../interfaces/ManualServer/IBandwidthThreshold";
import {ShadowboxServer} from "./Shadowbox";
import {hexToString} from "../../core/utils/hexEncoding";

import IManualServerDto from "./IManualServerDto";

import database from '../../databaseAccessLayer';

// Exceptions
import ManualServerExceptions from "../../core/exceptions/ManualServerExceptions";
import IManualServerConfig from "../interfaces/ManualServer/IManualServerConfig";

class ManualServer extends ShadowboxServer implements IManualServer {
  private _rowId: number;
  get rowId() {return this._rowId;}
  set rowId(value: number) {
    if (!this._rowId) {
      this._rowId = value;
    }
  }
  
  host;
  fingerprint;
  
  certSha256;
  
  isCertificateTrusted = false;
  
  bandwidthThreshold = {
    megaBytes: 5000000000
  };
  
  constructor(
    readonly manualServerId: string,
    private manualServerConfig: IManualServerConfig,
    private forgetCallback: Function,
    bandwidth?: IBandwidthThreshold
  ) {
    super(manualServerId);
    
    this.managementApiUrl = manualServerConfig.apiUrl;
    this.certSha256 = manualServerConfig.certSha256;
    
    if (bandwidth) {
      this.bandwidthThreshold = bandwidth;
    }
    
    // Shadowbox
    this.setManagementApiUrl(manualServerConfig.apiUrl);
    
    // manualServerConfig.certSha256 is expected to be in hex format (install script).
    // Electron requires that this be decoded from hex (to unprintable binary),
    // then encoded as base64.
    try {
      const parsed = new URL(manualServerConfig.apiUrl);
      const fingerprint = Buffer.from(hexToString(manualServerConfig.certSha256)).toString('base64');
      // trustCertificate(parsed.host, fingerprint);
      this.host = parsed.host;
      this.fingerprint = fingerprint;
      
      // This is very shallow, because it doesn't use the `trustCertificate` function.
      this.isCertificateTrusted = true;
    } catch (e) {
      // Error trusting certificate, may be due to bad user input.
      console.error('Error trusting certificate');
      console.debug('Server Config: ', manualServerConfig);
      throw new Error(ManualServerExceptions.INVALID_CERTIFICATE.userError);
    }
  }
  
  getCertificateFingerprint() {
    return this.manualServerConfig.certSha256;
  }
  
  forget(): void {
    this.forgetCallback();
  }
  
  public toJSON(): IManualServerDto {
    return {
      name: this.getName(),
      portForNewAccessKeys: this.getPortForNewAccessKeys(),
      rowId: this.rowId,
      manualServerId: this.id,
      managementApiUrl: this.manualServerConfig.apiUrl,
      host: this.host,
      bandwidthThreshold: this.bandwidthThreshold,
      defaultDataLimit: this.getDefaultDataLimit(),
      isMetricsEnabled: this.getMetricsEnabled()
    }
  }
  
  // *NOTE* This method pre-assumes that the server is healthy.
  public async saveToDatabase() {
    const serverConfig = await this.getServerConfig();
    
    if (this.rowId === undefined) {
      // insert
      const [, metadata] = await database.manualServerEntity.insertManualServer(serverConfig, this.manualServerConfig);
      if (metadata && metadata['lastID']) {
        this.rowId = metadata['lastID'];
      }
    } else {
      // update
      await database.manualServerEntity.updateManualServerByRowId(this.rowId, serverConfig, this.manualServerConfig, this.bandwidthThreshold);
    }
  }
}

export default ManualServer;