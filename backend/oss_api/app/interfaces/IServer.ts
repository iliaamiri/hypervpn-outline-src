import {BytesByAccessKey, AccessKeyId, DataLimit, IAccessKeyDto} from './IAccessKey';

export interface IServer {
    // Gets a globally unique identifier for this Server.  THIS MUST NOT make a network request, as
    readonly id: string;
    
    rowId?: number;

    // Gets the server's name for display.
    getName(): string;
    // Updates the server name.
    setName(name: string): Promise<void>;
    
    // Gets the version of the shadowbox binary the server is running
    getVersion(): string;

    // Lists the access keys for this server, including the admin.
    listAccessKeys(): Promise<IAccessKeyDto[]>;

    // Returns stats for bytes transferred across all access keys of this server.
    getDataUsage(): Promise<BytesByAccessKey>;

    // Adds a new access key to this server.
    addAccessKey(): Promise<IAccessKeyDto>;

    // Renames the access key given by id.
    renameAccessKey(accessKeyId: AccessKeyId, name: string): Promise<void>;

    // Removes the access key given by id.
    removeAccessKey(accessKeyId: AccessKeyId): Promise<void>;

    // Sets a default access key data transfer limit over a 30 day rolling window for all access keys.
    // This limit is overridden by per-key data limits.  Forces enforcement of all data limits,
    // including per-key data limits.
    setDefaultDataLimit(limit: DataLimit): Promise<void>;

    // Returns the server default access key data transfer limit, or undefined if it has not been set.
    getDefaultDataLimit(): DataLimit | undefined;

    // Removes the server default data limit.  Per-key data limits are still enforced.  Traffic is
    // tracked for if the limit is re-enabled.  Forces enforcement of all data limits, including
    // per-key limits.
    removeDefaultDataLimit(): Promise<void>;

    // Sets the custom data limit for a specific key. This limit overrides the server default limit
    // if it exists. Forces enforcement of the chosen key's data limit.
    setAccessKeyDataLimit(accessKeyId: AccessKeyId, limit: DataLimit): Promise<void>;

    // Removes the custom data limit for a specific key.  The key is still bound by the server default
    // limit if it exists. Forces enforcement of the chosen key's data limit.
    removeAccessKeyDataLimit(accessKeyId: AccessKeyId): Promise<void>;

    // Returns whether metrics are enabled.
    getMetricsEnabled(): boolean;

    // Updates whether metrics are enabled.
    setMetricsEnabled(metricsEnabled: boolean): Promise<void>;

    // Gets the ID used for metrics reporting.
    getMetricsId(): string;

    // Checks if the server is healthy.
    isHealthy(timeoutMs?: number): Promise<boolean>;

    // Gets the date when this server was created.
    getCreatedDate(): Date;

    // Returns the server's domain name or IP address.
    getHostnameForAccessKeys(): string;

    // Changes the hostname for shared access keys.
    setHostnameForAccessKeys(hostname: string): Promise<void>;

    // Returns the server's management API URL.
    getManagementApiUrl(): string;

    // Returns the port number for new access keys.
    // Returns undefined if the server doesn't have a port set.
    getPortForNewAccessKeys(): number | undefined;

    // Changes the port number for new access keys.
    setPortForNewAccessKeys(port: number): Promise<void>;

    getServerConfig(): Promise<ServerConfigJson>
}

export interface ServerConfigJson {
    name: string;
    metricsEnabled: boolean;
    serverId: string;
    createdTimestampMs: number;
    portForNewAccessKeys: number;
    hostnameForAccessKeys: string;
    version: string;
    // This is the server default data limit.  We use this instead of defaultDataLimit for API
    // backwards compatibility.
    accessKeyDataLimit?: DataLimit;
}

export class DataAmount {
    terabytes: number;
}

export class MonetaryCost {
    // Value in US dollars.
    usd: number;
}