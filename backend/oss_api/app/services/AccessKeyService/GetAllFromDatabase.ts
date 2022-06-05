import database from "../../../databaseAccessLayer";
import {IAccessKeyEntity} from "../../../databaseAccessLayer/sql/IAccessKeyEntity";

export default async function GetAllFromDatabase(): Promise<IAccessKeyEntity[]> {
  return await database.accessKeyEntity.findAll();
}