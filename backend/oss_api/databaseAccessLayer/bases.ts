import { createClient } from 'redis';
import { Sequelize } from 'sequelize';
import appConfig from "../config/app.config";

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: appConfig.sqliteFilePath
});



//const redisClient = createClient({
//    url: 'redis://172.17.0.3:6379'
//});

//redisClient.on('error', (err) => console.log('Redis Client Error', err));

//await redisClient.connect();

//const allCurrentOutlineManualServers = await redisClient.get('outlineManualServers');
//console.debug(JSON.parse(allCurrentOutlineManualServers));

export default {
  //redisClient,
  sequelize
}