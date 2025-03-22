const defaultConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "postgres",
  pool: {
    max: 20,
  },
  define: {
    freezeTableName: true,
  },
};

export default {
  development: {
    ...defaultConfig,
  },
  production: {
    ...defaultConfig,
    logging: false,
  },
  test: {
    ...defaultConfig,
    logging: false,
  },
};
