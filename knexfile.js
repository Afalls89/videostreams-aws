const ENV = process.env.NODE_ENV || "production";

const { DB_URL } = process.env;

const { username, password } = require("./credentials");

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
  test: {
    connection: {
      database: "videostreams_test",
      username: username,
      password: password,
    },
  },
};

module.exports = { ...customConfig[ENV], ...baseConfig };
