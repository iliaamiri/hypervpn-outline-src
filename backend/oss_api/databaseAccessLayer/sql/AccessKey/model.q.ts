import IDataLimit from "../../../app/interfaces/AccessKey/IDataLimit";
import {IAccessKeyEntity} from "../IAccessKeyEntity";
import {QueryTypes} from "sequelize";
import IAccessKeyId from "../../../app/interfaces/AccessKey/IAccessKeyId";

export default function getQueries(database, tableName) {
  
  
  async function findByRowId(rowId): Promise<IAccessKeyEntity | null> {
    const query = `SELECT * FROM ${tableName} WHERE id = :rowId`;
    const result = await database.query(
      query,
      {
        replacements: {rowId: rowId},
        type: QueryTypes.SELECT
      }
    );
    return (result && result.length > 0) ? result[0] as IAccessKeyEntity : null;
  }
  
  async function findByKeyIdAndServerRowId(keyId, serverRowId): Promise<IAccessKeyEntity | null> {
    const query = `SELECT * FROM ${tableName} WHERE keyId = :keyId AND serverRowId = :serverRowId`;
    const result = await database.query(
      query,
      {
        replacements: {
          keyId: keyId,
          serverRowId: serverRowId
        },
        type: QueryTypes.SELECT
      }
    );
    return (result && result.length > 0) ? result[0] as IAccessKeyEntity : null;
  }
  
  async function updateByRowId(rowId, name: string, accessUrl: string, dataLimit: IDataLimit) {
    const sqlUpdateQuery = `UPDATE ${tableName} SET name = :name, accessUrl = :accessUrl, dataLimit = :dataLimit WHERE id = :rowId`;
    
    return database.query(
      sqlUpdateQuery,
      {
        replacements: {
          name: name,
          accessUrl: accessUrl,
          dataLimit: dataLimit.bytes,
          rowId: rowId
        }
      }
    );
  }
  
  async function insertNewAccessKey(keyId: IAccessKeyId, name, accessUrl, dataLimit, serverRowId) {
    const sqlInsertQuery = `INSERT INTO ${tableName}
            (keyId, name, accessUrl, dataLimit, serverRowId, createdAt)
            VALUES (:keyId, :name, :accessUrl, :dataLimit, :serverRowId, :createdAt)`;
    
    return await database.query(
      sqlInsertQuery,
      {
        replacements: {
          keyId: keyId,
          name: name,
          accessUrl: accessUrl,
          dataLimit: dataLimit.bytes,
          serverRowId: serverRowId,
          createdAt: Date.now()
        }
      }
    );
  }
  
  async function deleteByRowId(rowId): Promise<any> {
    const sqlDeleteQuery = `DELETE FROM ${tableName} WHERE id = :rowId`;
    
    return database.query(
      sqlDeleteQuery,
      {
        replacements: {rowId: rowId}
      }
    );
  }
  
  return {
    findByRowId,
    findByKeyIdAndServerRowId,
    updateByRowId,
    insertNewAccessKey,
    deleteByRowId,
  }
}