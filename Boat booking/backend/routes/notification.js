const express = require("express");
const pool = require("../db");
const router = express.Router();

// Handle POST request to /api/notification
router.post("/notification", async (req, res) => {
  try {
    const createNotificationQuery = `
      INSERT INTO notification (title, date,booking_start_time)
      VALUES ($1, $2, $3)
      RETURNING id, title, date,booking_start_time
    `;
    const { title, date, booking_start_time } = req.body;

    await pool.query(createNotificationQuery, [
      title,
      date,
      booking_start_time,
    ]);

    res.status(201).json({
      status: "Success",
      message: "Notification added successfully",
    });
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation error
      return res
        .status(400)
        .json({ error: "Notification exist for this booking_start_time" });
    }
    console.error("Error uploading notification:", error);
    res.status(500).json({
      status: "Failed",
      message: "Unable to add notification",
    });
  }
});

// Handle Get request to /api/notification
router.get("/notification", async (req, res) => {
  try {
    const notification = await pool.query("Select * from notification");

    res.status(200).json(notification.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Handle Delete request to /api/notification
router.delete("/notification/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteNotificationQuery = `
      DELETE FROM notification
      WHERE id = $1
    `;
    await pool.query(deleteNotificationQuery, [id]);

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
// Handle Delete all request to /api/notification
router.delete("/notification", async (req, res) => {
  try {
    await pool.query("DELETE FROM notification");

    res.status(200).json({
      message: "All Notification deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
