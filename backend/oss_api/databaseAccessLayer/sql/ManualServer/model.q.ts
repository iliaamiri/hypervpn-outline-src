import {QueryTypes} from "sequelize";

import * as entityInterfaces from '../IManualServerEntity';
import ServerConfigJSON from "../../../app/interfaces/Server/ServerConfigJSON";
import IManualServerConfig from "../../../app/interfaces/ManualServer/IManualServerConfig";
import IBandwidthThreshold from "../../../app/interfaces/ManualServer/IBandwidthThreshold";

export default function getQueries(database, tableName) {
  async function insertManualServer(
    serverConfig: ServerConfigJSON,
    managementServerConfig: IManualServerConfig,
    bandwidthThreshold: IBandwidthThreshold
  ) {
    const sqlInsertQuery = `
      INSERT INTO ${tableName} (manualServerId, name, shadowboxVersion, defaultDataLimit, bandwidthThreshold, metricsEnabled, hostnameForAccessKeys, managementApiUrl, certSha256, portForNewAccessKeys, createdAt)
      VALUES (:manualServerId, :name, :shadowboxVersion, :defaultDataLimit, :bandwidthThreshold, :metricsEnabled, :hostnameForAccessKeys, :managementApiUrl, :certSha256, :portForNewAccessKeys, :createdAt)
      `;
    return database.query(
      sqlInsertQuery,
      {
        replacements: {
          manualServerId: serverConfig.serverId,
          name: serverConfig.name,
          shadowboxVersion: serverConfig.version,
          defaultDataLimit: serverConfig.accessKeyDataLimit?.bytes ?? 0,
          bandwidthThreshold: bandwidthThreshold?.megaBytes ?? 0,
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
  
  async function updateManualServerByRowId(
    rowId: number,
    serverConfig: ServerConfigJSON,
    managementServerConfig: IManualServerConfig,
    bandwidthThreshold: IBandwidthThreshold
  ): Promise<any> {
    const sqlUpdateQuery = `
      UPDATE ${tableName} SET
      
      name = :name,
      shadowboxVersion = :shadowboxVersion,
      defaultDataLimit = :defaultDataLimit,
      bandwidthThreshold = :bandwidthThreshold,
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
          bandwidthThreshold: bandwidthThreshold?.megaBytes ?? 0,
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