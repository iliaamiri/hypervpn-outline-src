import {QueryTypes} from "sequelize";
import * as entityInterfaces from '../IManualServerEntity';

export default function getQueries(database, tableName) {
  async function findAll(): Promise<entityInterfaces.IManualServerEntity[] | null> {
    const sqlSelectQuery = `SELECT * FROM ${tableName}`;
    const sqlResult = await database.query(
      sqlSelectQuery,
      {
        type: QueryTypes.SELECT
      });
    return (sqlResult && sqlResult.length > 0) ? sqlResult as entityInterfaces.IManualServerEntity[] : null;
  }
  
  async function findByManagementApiUrl(managementApiUrl): Promise<entityInterfaces.IManualServerEntity | null> {
    const sqlSelectQuery = `SELECT * FROM ${tableName} WHERE managementApiUrl = :managementApiUrl`;
    const sqlResult = await database.query(
      sqlSelectQuery,
      {
        type: QueryTypes.SELECT
      });
    return (sqlResult && sqlResult.length > 0) ? sqlResult[0] as entityInterfaces.IManualServerEntity : null;
  }
  
  return {
    findAll,
    findByManagementApiUrl
  };
}