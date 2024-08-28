const {Sequelize} = require('sequelize');

const STORAGE_PATH = `data/storage${process.env.PREVIEW_MODE === "true" ? "_preview" : ""}.db`;

Sequelize.DATE.prototype._stringify = () => {
    return new Date().toISOString();
}

const createSequelizeInstance = (config) => {
    const { dialect, storage, host } = config;

    if (dialect !== 'sqlite' && (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASS)) {
        throw new Error("Missing database environment variables");
    }

    const options = {
        dialect,
        logging: false,
        query: { raw: true },
        ...(dialect === 'sqlite' ? { storage } : {}),
        ...(host ? { host } : {})
    };

    return new Sequelize(
      process.env.DB_NAME || undefined,
      process.env.DB_USER || undefined,
      process.env.DB_PASS || undefined,
      options
    );
};

const configMap = {
    mysql: { dialect: 'mysql', host: process.env.DB_HOST || 'localhost' },
    postgres: { dialect: 'postgres', host: process.env.DB_HOST || 'localhost' },
    sqlite: { dialect: 'sqlite', storage: STORAGE_PATH },
};

const dbType = process.env.DB_TYPE || 'sqlite';

if (!configMap[dbType]) {
    throw new Error("Invalid database type");
}

module.exports = createSequelizeInstance(configMap[dbType]);
