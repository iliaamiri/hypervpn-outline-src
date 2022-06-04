import {IAccessKeyEntity} from "../IAccessKeyEntity";
import {QueryTypes} from "sequelize";

export default function getQueries(database, tableName) {
  async function findAll(): Promise<IAccessKeyEntity[]> {
    const query = `SELECT * FROM ${tableName}`;
    const result = await database.query(
      query,
      { type: QueryTypes.SELECT }
    );
    return (result && result.length > 0) ? result as IAccessKeyEntity[] : [];
  }
  
  return {
    findAll
  };
}