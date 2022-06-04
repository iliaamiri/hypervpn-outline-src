import config from '../../config/app.config';
import fetch from "node-fetch";
import * as semver from 'semver';

import ShadowboxExceptions from "../../core/exceptions/ShadowboxException";

import {IServer, ServerConfigJson} from '../interfaces/IServer';

import {
  makeAccessKeyModel,
  DataLimit,
  AccessKeyJson,
  AccessKeyId,
  BytesByAccessKey,
  IAccessKeyDto
} from '../interfaces/IAccessKey';

if (config.appDebug) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

interface DataUsageByAccessKeyJson {
  // The accessKeyId should be of type AccessKeyId, however that results in the tsc
  // error TS1023: An index signature parameter type must be 'string' or 'number'.
  // See https://github.com/Microsoft/TypeScript/issues/2491
  // TODO: this still says "UserId", changing to "AccessKeyId" will require
  // a change on the shadowbox server.
  bytesTransferredByUserId: {[accessKeyId: string]: number};
}


export class ShadowboxServer implements IServer {
  managementApiUrl: string;
  private serverConfig: ServerConfigJson;

  getName(): string {
    return this.serverConfig?.name;
  }
  setName(name: string): Promise<void> {
    console.info('Setting server name');
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name}),
    };
    return this.apiRequest<void>('name', requestOptions).then(() => {
      this.serverConfig.name = name;
    });
  }
  
  readonly shadowboxVersion: string;


  constructor(readonly id: string) {}

  listAccessKeys(): Promise<IAccessKeyDto[]> {
    console.info('Listing access keys');
    return this.apiRequest<{accessKeys: AccessKeyJson[]}>('access-keys').then((response) => {
      return response.accessKeys.map(makeAccessKeyModel);
    });
  }

  async addAccessKey(): Promise<IAccessKeyDto> {
    console.info('Adding access key');
    return makeAccessKeyModel(
      await this.apiRequest<AccessKeyJson>('access-keys', {method: 'POST'})
    );
  }

  renameAccessKey(accessKeyId: AccessKeyId, name: string): Promise<void> {
    console.info('Renaming access key');
    const body = new FormData();
    body.append('name', name);
    return this.apiRequest<void>('access-keys/' + accessKeyId + '/name', {method: 'PUT', body});
  }

  removeAccessKey(accessKeyId: AccessKeyId): Promise<void> {
    console.info('Removing access key');
    return this.apiRequest<void>('access-keys/' + accessKeyId, {method: 'DELETE'});
  }

  async setDefaultDataLimit(limit: DataLimit): Promise<void> {
    console.info(`Setting server default data limit: ${JSON.stringify(limit)}`);
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({limit}),
    };
    await this.apiRequest<void>(this.getDefaultDataLimitPath(), requestOptions);
    this.serverConfig.accessKeyDataLimit = limit;
  }

  async removeDefaultDataLimit(): Promise<void> {
    console.info(`Removing server default data limit`);
    await this.apiRequest<void>(this.getDefaultDataLimitPath(), {method: 'DELETE'});
    delete this.serverConfig.accessKeyDataLimit;
  }

  getDefaultDataLimit(): DataLimit | undefined {
    return (this.serverConfig) ? this.serverConfig.accessKeyDataLimit : undefined;
  }

  private getDefaultDataLimitPath(): string {
    const version = this.getVersion();
    if (semver.gte(version, '1.4.0')) {
      // Data limits became a permanent feature in shadowbox v1.4.0.
      return 'server/access-key-data-limit';
    }
    return 'experimental/access-key-data-limit';
  }

  async setAccessKeyDataLimit(keyId: AccessKeyId, limit: DataLimit): Promise<void> {
    console.info(`Setting data limit of ${limit.bytes} bytes for access key ${keyId}`);
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({limit}),
    };
    await this.apiRequest<void>(`access-keys/${keyId}/data-limit`, requestOptions);
  }

  async removeAccessKeyDataLimit(keyId: AccessKeyId): Promise<void> {
    console.info(`Removing data limit from access key ${keyId}`);
    await this.apiRequest<void>(`access-keys/${keyId}/data-limit`, {method: 'DELETE'});
  }

  async getDataUsage(): Promise<BytesByAccessKey> {
    const jsonResponse = await this.apiRequest<DataUsageByAccessKeyJson>('metrics/transfer');
    const usageMap = new Map<AccessKeyId, number>();
    for (const [accessKeyId, bytes] of Object.entries(jsonResponse.bytesTransferredByUserId)) {
      usageMap.set(accessKeyId, bytes ?? 0);
    }
    return usageMap;
  }

  getVersion(): string {
    return (this.serverConfig) ? this.serverConfig.version : '';
  }

  getMetricsEnabled(): boolean {
    return this.serverConfig.metricsEnabled;
  }

  setMetricsEnabled(metricsEnabled: boolean): Promise<void> {
    const action = metricsEnabled ? 'Enabling' : 'Disabling';
    console.info(`${action} metrics`);
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({metricsEnabled}),
    };
    return this.apiRequest<void>('metrics/enabled', requestOptions).then(() => {
      this.serverConfig.metricsEnabled = metricsEnabled;
    });
  }

  getMetricsId(): string {
    return this.serverConfig.serverId;
  }

  getCreatedDate(): Date | null {
    if (!this.serverConfig?.createdTimestampMs) {
      return null;
    }
    return new Date(this.serverConfig.createdTimestampMs);
  }

  async setHostnameForAccessKeys(hostname: string): Promise<void> {
    console.info(`setHostname ${hostname}`);
    this.serverConfig.hostnameForAccessKeys = hostname;
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({hostname}),
    };
    return this.apiRequest<void>('server/hostname-for-access-keys', requestOptions).then(() => {
      this.serverConfig.hostnameForAccessKeys = hostname;
    });
  }

  getHostnameForAccessKeys(): string {
    try {
      return (
        this.serverConfig?.hostnameForAccessKeys ?? new URL(this.managementApiUrl).hostname
      );
    } catch (e) {
      return '';
    }
  }

  getPortForNewAccessKeys(): number | undefined {
    try {
      if (typeof this.serverConfig.portForNewAccessKeys !== 'number') {
        return undefined;
      }
      return this.serverConfig.portForNewAccessKeys;
    } catch (e) {
      return undefined;
    }
  }

  setPortForNewAccessKeys(newPort: number): Promise<void> {
    console.info(`setPortForNewAccessKeys: ${newPort}`);
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({port: newPort}),
    };
    return this.apiRequest<void>('server/port-for-new-access-keys', requestOptions).then(() => {
      this.serverConfig.portForNewAccessKeys = newPort;
    });
  }

  async getServerConfig(): Promise<ServerConfigJson> {
    console.info('Retrieving server configuration');
    return await this.apiRequest<ServerConfigJson>('server');
  }

  protected setManagementApiUrl(apiAddress: string): void {
    this.managementApiUrl = apiAddress;
  }

  getManagementApiUrl() {
    return this.managementApiUrl;
  }

  // Makes a request to the management API.
  private apiRequest<T>(path: string, options?: any): Promise<T> {
    try {
      let apiAddress = this.managementApiUrl;
      if (!apiAddress) {
        const msg = 'Management API address unavailable';
        console.error(msg);
        throw new Error(msg);
      }
      if (!apiAddress.endsWith('/')) {
        apiAddress += '/';
      }
      const url = apiAddress + path;
      return fetch(url, options)
        .then(
          (response) => {
            if (!response.ok) {
              // console.log(response);
              throw ShadowboxExceptions.API_REQUEST_FAILED;
              // throw new errors.ServerApiError(
              //   `API request to ${path} failed with status ${response.status}`,
              //   response
              // );
            }
            return response.text();
          },
          (_error) => {
            throw ShadowboxExceptions.NETWORK_ERROR;
            // throw new errors.ServerApiError(`API request to ${path} failed due to network error`);
          }
        )
        .then((body) => {
          if (!body) {
            return;
          }
          return JSON.parse(body);
        });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  public async isHealthy(timeoutMs = 30000): Promise<boolean> {
    // Return not healthy if API doesn't complete within timeoutMs.
    const timeout = setTimeout(() => {
      return false;
    }, timeoutMs);
    
    
    // Query the API and expect a successful response to validate that the
    // service is up and running.
    
    let isFulfilled = false;
    // Try 3 times and see if the server is reachable or not.
    for (let i = 0; i < 3; i++) {
      isFulfilled = await new Promise((resolve, reject) => {
        setTimeout(() => {
          this.getServerConfig().then(
            (serverConfig) => {
              this.serverConfig = serverConfig;
              resolve(true);
            },
            (_e) => {
              console.debug("DEBUG ERROR: ", _e);
              resolve(false);
            }
          );
        }, 2000);
      });
      if (isFulfilled) {
        clearTimeout(timeout);
        return true;
      }
    }
  }
}