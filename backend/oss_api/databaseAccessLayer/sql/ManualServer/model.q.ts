import {QueryTypes} from "sequelize";

import * as entityInterfaces from '../IManualServerEntity';
import {ServerConfigJson} from "../../../app/interfaces/IServer";
import {ManualServerConfig} from "../../../app/interfaces/ManualServer/IManualServer";

export default function getQueries(database, tableName) {
  async function insertManualServer(serverConfig: ServerConfigJson, managementServerConfig: ManualServerConfig) {
    const sqlInsertQuery = `
      INSERT INTO ${tableName} (manualServerId, name, shadowboxVersion, defaultDataLimit, metricsEnabled, hostnameForAccessKeys, managementApiUrl, certSha256, portForNewAccessKeys, createdAt)
      VALUES (:manualServerId, :name, :shadowboxVersion, :defaultDataLimit, :metricsEnabled, :hostnameForAccessKeys, :managementApiUrl, :certSha256, :portForNewAccessKeys, :createdAt)
      `;
    return database.query(
      sqlInsertQuery,
      {
        replacements: {
          manualServerId: serverConfig.serverId,
          name: serverConfig.name,
          shadowboxVersion: serverConfig.version,
          defaultDataLimit: serverConfig.accessKeyDataLimit?.bytes ?? 0,
          metricsEnabled: serverConfig.metricsEnabled ? 1 : 0,
          hostnameForAccessKeys: serverConfig.hostnameForAccessKeys,
          managementApiUrl: managementServerConfig.apiUrl,
          certSha256: managementServerConfig.certSha256,
          portForNewAccessKeys: serverConfig.portForNewAccessKeys,
          createdAt: serverConfig.createdTimestampMs
        }
      }
    );
  }
  
  async function findManualServerByRowId(rowId: number): Promise<entityInterfaces.IManualServerEntity> | null {
    const sqlSelectQuery = `SELECT * FROM ${tableName} WHERE id = :rowId`;
    const result = await database.query(
      sqlSelectQuery,
      {
        replacements: {keyId: rowId},
        type: QueryTypes.SELECT
      }
    );
    return (result && result.length > 0) ? result[0] as entityInterfaces.IManualServerEntity : null;
  }
  
  async function updateManualServerByRowId(rowId: number, serverConfig: ServerConfigJson, managementServerConfig: ManualServerConfig): Promise<any> {
    const sqlUpdateQuery = `
      UPDATE ${tableName} SET
      
      name = :name,
      shadowboxVersion = :shadowboxVersion,
      defaultDataLimit = :defaultDataLimit,
      metricsEnabled = :metricsEnabled,
      hostnameForAccessKeys = :hostnameForAccessKeys,
      managementApiUrl = :managementApiUrl,
      certSha256 = :certSha256,
      portForNewAccessKeys = :portForNewAccessKeys,
      createdAt = :createdAt
      
      WHERE id = :rowId
      `;
    
    return database.query(
      sqlUpdateQuery,
      {
        replacements: {
          name: serverConfig.name,
          shadowboxVersion: serverConfig.version,
          defaultDataLimit: serverConfig.accessKeyDataLimit?.bytes ?? 0,
          metricsEnabled: serverConfig.metricsEnabled ? 1 : 0,
          hostnameForAccessKeys: serverConfig.hostnameForAccessKeys,
          managementApiUrl: managementServerConfig.apiUrl,
          certSha256: managementServerConfig.certSha256,
          portForNewAccessKeys: serverConfig.portForNewAccessKeys,
          createdAt: serverConfig.createdTimestampMs,
          rowId: rowId
        }
      }
    );
  }
  
  return {
    insertManualServer,
    findManualServerByRowId,
    updateManualServerByRowId,
  };
}