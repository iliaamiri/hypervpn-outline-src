// development
export const sqlDbConfigDev = {
    host: process.env.SQL_DB_HOST || "localhost",
    username: process.env.SQL_DB_USERNAME || "root",
    password: process.env.SQL_DB_PASSWORD || "",
    port: process.env.SQL_DB_PORT || "3306",
    database: process.env.SQL_DB_NAME || "db_name",
    dialect: process.env.SQL_DB_DIALECT || 'mysql',
    ssl: false,
    // define: {
    //     timestamps: false,
    //     freezeTableName: true
    // },
};

export const sqliteFilePath = "../hypervpn.db";