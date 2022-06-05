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
        replacements: {managementApiUrl: managementApiUrl},
        type: QueryTypes.SELECT
      });
    return (sqlResult && sqlResult.length > 0) ? sqlResult[0] as entityInterfaces.IManualServerEntity : null;
  }
  
  async function findByRowId(rowId: number): Promise<entityInterfaces.IManualServerEntity | null> {
    const sqlSelectQuery = `SELECT * FROM ${tableName} WHERE id = :rowId`;
    const sqlResult = await database.query(
      sqlSelectQuery,
      {
        replacements: {rowId: rowId},
        type: QueryTypes.SELECT
      });
    return (sqlResult && sqlResult.length > 0) ? sqlResult[0] as entityInterfaces.IManualServerEntity : null;
  }
  
  async function deleteByRowId(rowId: number) {
    const sqlDeleteQuery = `DELETE FROM ${tableName} WHERE id = :rowId`;
    const [, metadata] = await database.query(
      sqlDeleteQuery,
      {replacements: {rowId: rowId}}
    );
    return metadata
  }
  
  return {
    findAll,
    findByManagementApiUrl,
    findByRowId,
    deleteByRowId
  };
}