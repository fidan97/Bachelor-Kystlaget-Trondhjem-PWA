const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();
const port = process.env.PORT || 5000;
const imageUpload = require("./routes/imageUpload");
const notification = require("./routes/notification");
const createUserTable = require("./models/userImage");
const createNotificationTable = require("./models/notifications");
const app = express();

app.use(express.json());

app.use(cors());

pool.connect();
createUserTable();
createNotificationTable();
//  routes
app.use("/api", imageUpload);
app.use("/api", notification);

app.get("/all", async (req, res) => {
  try {
    const userInfo = await pool.query("Select * from users");
    res.send(userInfo);
  } catch (error) {
    console.log(error);
  }
});
app.get("/", async (req, res) => {
  res.send("server running..");
});

app.listen(port, () => {
  console.log("app is listening on port ", { port });
});
