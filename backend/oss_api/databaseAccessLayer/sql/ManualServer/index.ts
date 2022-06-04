import getModelQueries from "./model.q";
import getRepoQueries from "./repository.q";

const tableName = "manual_server";

function init() {
  const database = this.databaseInstance;
  
  return {
    ...getModelQueries(database, tableName),
    ...getRepoQueries(database, tableName)
  }
}

export {init, tableName};