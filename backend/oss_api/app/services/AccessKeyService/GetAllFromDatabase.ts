import database from "../../../databaseAccessLayer";

export default async function GetAllFromDatabase() {
  return await database.accessKeyEntity.findAll();
}