import IDataLimit from "../interfaces/AccessKey/IDataLimit";
import IAccessKeyId from "../interfaces/AccessKey/IAccessKeyId";

export default interface IAccessKeyDto {
  rowId?: number;
  id: IAccessKeyId;
  name: string;
  accessUrl: string;
  dataLimit?: IDataLimit;
  
  // Note: These weren't mentioned in while receiving the new access key from the api.
  password?: string;
  port?: number;
  method?: string;
}