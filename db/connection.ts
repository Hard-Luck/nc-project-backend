const { Pool } = require("pg");
const ENV: string = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};
if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set");
}
module.exports = new Pool(config);