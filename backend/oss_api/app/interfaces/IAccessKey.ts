export type AccessKeyId = string;

export interface IAccessKeyDto {
    rowId?: number;
    id: AccessKeyId;
    name: string;
    accessUrl: string;
    dataLimit?: DataLimit;
    
    // Note: These weren't mentioned in while receiving the new access key from the api.
    password?: string;
    port?: number;
    method?: string;
}

export type BytesByAccessKey = Map<AccessKeyId, number>;

// Data transfer allowance, measured in bytes.
// NOTE: Must be kept in sync with the definition in src/shadowbox/access_key.ts.
export interface DataLimit {
    bytes: number;
}

export interface AccessKeyJson {
    id: string;
    name: string;
    accessUrl: string;
}

// Converts the access key JSON from the API to its model.
export function makeAccessKeyModel(apiAccessKey: AccessKeyJson): IAccessKeyDto {
    return apiAccessKey as IAccessKeyDto;
}