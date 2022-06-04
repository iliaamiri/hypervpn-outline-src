import config from './config/app.config';

import getApplication from './app';

const PORT = config.port;

const APP_URL = config.appUrl;

const server = getApplication();
server.listen(PORT, () => {
    console.log(`Server is available on ${APP_URL}:${PORT}`);
});