const pool = require("../db");

// Function to create the users table
function createUserTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      userid TEXT UNIQUE NOT NULL,
      imagename TEXT,
      imagetype TEXT,
      imagedata TEXT
    )`;

  return pool.query(createTableQuery);
}

// Execute the function and handle the promise it returns
createUserTable()
  .then(() => console.log("User table created successfully"))
  .catch((error) => console.error("Error creating user table:", error));

module.exports = createUserTable;
