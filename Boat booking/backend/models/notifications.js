const pool = require("../db");

// Function to create the users table
function createNotificationTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS notification(
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      booking_start_time TEXT UNIQUE NOT NULL
    )`;

  return pool.query(createTableQuery);
}

// Execute the function and handle the promise it returns
createNotificationTable()
  .then(() => console.log("Notification table created successfully"))
  .catch((error) => console.error("Error creating notification table:", error));

module.exports = createNotificationTable;
