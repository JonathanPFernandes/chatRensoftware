require("../bootstrap");

module.exports = {
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin"
  },
  dialect: process.env.DB_DIALECT || "mysql",
  timezone: process.env.DB_TIMEZONE || "-03:00",
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'press-ticket-1',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Jpf132545',
  port: process.env.DB_PORT || 3306,
  logging: false,
  seederStorage: "json",
  seederStoragePath: "sequelizeData.json"
};
