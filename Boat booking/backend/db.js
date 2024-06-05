require("dotenv").config();

const { Pool } = require("pg");
// const databaseUrl = process.env.DATABASE;
const pool = new Pool({
  // connectionString: databaseUrl,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});
pool.on("connect", (client) => {
  console.log("Database connected");
});
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
