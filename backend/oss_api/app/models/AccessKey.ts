import {DataLimit, IAccessKeyDto, AccessKeyId} from "../interfaces/IAccessKey";
import {IServer} from "../interfaces/IServer";

import database from "../../databaseAccessLayer";

export class AccessKey {
  private _rowId: number;
  get rowId() {return this._rowId;}
  set rowId(value: number) {
    if (!this._rowId) {
      this._rowId = value;
    }
  }
  
  private _id: AccessKeyId;
  get id() {return this._id;}
  set id(value) { if (this._id === undefined){ this._id = value; }}
  
  get name() {return this._name;}
  set name(value) {
    this.server.setName(value)
      .then(() => {
        this._name = value
      });
  }
  
  private _password: string;
  get password() {return this._password;}
  set password(value) {this._password = value;}
  
  private _port: number;
  get port() {return this._port;}
  set port(value) {this._port = value;}
  
  private _method: string;
  get method() {return this._method;}
  set method(value) {this._method = value;}
  
  private _createdAt: number;
  get createdAt() {return this._createdAt;}
  set createdAt(value) {this._createdAt = value;}
  
  private _accessUrl: string;
  get accessUrl() {return this._accessUrl;}
  set accessUrl(value) {this._accessUrl = value;}
  
  get dataLimit() {return this._dataLimit;}
  set dataLimit(value: DataLimit) {this._dataLimit = value;}
  
  
  get server(): IServer {return this._server;}
  
  constructor(
    private _server: IServer,
    private _name: string,
    private _dataLimit?: DataLimit,
  ) {
    if (!this._dataLimit) {
      this._dataLimit = new class implements DataLimit {
        bytes: number;
      }
      this._dataLimit.bytes = 0;
    }
  }
  
  toJSON(): IAccessKeyDto {
    return {
      rowId: this.rowId,
      id: this.id,
      name: this.name,
      password: this.password || '',
      port: this.port || undefined,
      method: this.method || undefined,
      accessUrl: this.accessUrl
    } as IAccessKeyDto;
  }
  
  async saveToDb(): Promise<AccessKey> {
    if (this.rowId) {
      const sqlUpdateResult = await database.accessKeyEntity.updateByRowId(this.id, this.name, this.accessUrl, this.dataLimit);
      
      this.name = sqlUpdateResult['name'];
      this.accessUrl = sqlUpdateResult['accessUrl'];
      this.dataLimit = sqlUpdateResult['dataLimit'];
    } else {
      // insert
      const [result, metadata] = await database.accessKeyEntity.insertNewAccessKey(this.id, this.name, this.accessUrl, this.dataLimit, this.server.rowId);
      if (metadata && metadata['lastID']) {
        this.rowId = metadata['lastID'];
      }
    }
    
    return this;
  }
  
  async delete(): Promise<any> {
    return database.accessKeyEntity.deleteByRowId(this.id);
  }
}