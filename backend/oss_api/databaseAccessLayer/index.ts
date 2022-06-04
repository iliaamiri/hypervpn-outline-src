import {sequelize} from './bases';
import sqlEntityManager from './sql';

const entities = await sqlEntityManager(sequelize);

export default entities;