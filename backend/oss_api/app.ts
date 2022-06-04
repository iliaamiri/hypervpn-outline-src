import { sessionOptions } from './config/session';

import session from 'express-session';

import routes from './routes/index';
import express, {Application} from 'express';

function getApplication() {
  const app: Application = express();

  // app.use(express.static(pathToSwaggerUi));
  app.set('trust proxy', 1);
  app.use(session(sessionOptions));
  
  app.use('/', routes);
  
  return app;
}

export default getApplication;
