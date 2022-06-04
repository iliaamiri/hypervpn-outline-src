import config from '../config/app.config';

export const sessionOptions = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false} // TODO: https compatible
};