export default async function init(database) {
  await sqliteInit(database);
  
  const databaseConfig = {databaseInstance: database};
  
  const {init: accessKeyEntity} = await import('./AccessKey');
  const {init: manualServerEntity} = await import('./ManualServer');
  
  const entities = {
    accessKeyEntity: accessKeyEntity.bind(databaseConfig).call(),
    manualServerEntity: manualServerEntity.bind(databaseConfig).call()
  };
  
  // TypeScript doesn't understand when you loop over and call each entity init dynamically.
  // for (let entityName in entities) {
  //   entities[entityName] = entities[entityName].bind(databaseConfig).call();
  // }
  
  return entities;
}

async function sqliteInit(databaseInstance) {
  await databaseInstance.query(`
CREATE TABLE IF NOT EXISTS manual_server (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  manualServerId CHAR(150),
  name CHAR(50),
	shadowboxVersion CHAR(50),
	defaultDataLimit INTEGER,
	bandwidthThreshold INTEGER,
  metricsEnabled INTEGER,
  hostnameForAccessKeys CHAR(350),
  managementApiUrl CHAR(550),
  certSha256 CHAR(2000),
  portForNewAccessKeys INTEGER,
  createdAt INTEGER
)
`);
  await databaseInstance.query(`
CREATE TABLE IF NOT EXISTS access_key (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyId CHAR(150) NOT NULL,
  name CHAR(50),
  password CHAR(250),
  port INTEGER,
  method CHAR(200),
  accessUrl CHAR(700),
  dataLimit INTEGER,
  serverRowId CHAR(150),
  createdAt INTEGER NOT NULL,

  CONSTRAINT fk_manual_server_serverRowId
    FOREIGN KEY (serverRowId)
    REFERENCES manual_server (id)
)
`);
}