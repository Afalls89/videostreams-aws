const ENV = process.env.NODE_ENV || "development";

const { DB_URL } = process.env;

const { username, password } = require(ENV === "production"
  ? "./credentialsTemplate"
  : "./credentials");

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
    ssl: { rejectUnauthorized: false },
  },
  development: {
    connection: {
      database: "videostreams_test",
      username: username,
      password: password,
    },
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
