export interface IAccessKeyEntity {
  id: number,
  keyId: string,
  name: string,
  password: string,
  port: number,
  method: string,
  accessUrl: string,
  dataLimit: number,
  serverRowId: string,
  createdAt: number,
}