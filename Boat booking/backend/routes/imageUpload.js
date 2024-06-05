const express = require("express");
const pool = require("../db");
const router = express.Router();

// Handle POST request to /api/image-upload
router.post("/image-upload/:userid/:username", async (req, res) => {
  try {
    const userId = req.params.userid;
    const username = req.params.username;

    const image = req.body.image;
    const imageData = image.data;

    const getuserQuery = await pool.query(
      `SELECT * FROM users WHERE userid = $1`,
      [userId]
    );
    // update image if already exist
    if (getuserQuery.rowCount) {
      const updateUserQuery = `
      UPDATE  users SET imagename=$2, imagetype=$3, imagedata=$4
      WHERE userid = $1
      RETURNING id, userid, username, imagename, imagetype, imagedata
    `;

      await pool.query(updateUserQuery, [
        userId,
        image.name,
        image.type,
        imageData,
      ]);

      return res.status(201).json({
        status: "Success",
        message: "Image updated successfully",
      });
    }

    const createUserQuery = `
      INSERT INTO users (userid, username, imagename, imagetype, imagedata)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, userid, username, imagename, imagetype, imagedata
    `;

    await pool.query(createUserQuery, [
      userId,
      username,
      image.name,
      image.type,
      imageData,
    ]);

    res.status(201).json({
      status: "Success",
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      status: "Failed",
      message: "Unable to upload image",
    });
  }
});

// Handle Get request to /api/image-upload
router.get("/image-upload/:userid", async (req, res) => {
  try {
    const userId = req.params.userid;
    const getuserQuery = `SELECT * FROM users WHERE userid = $1`;

    const userInfo = await pool.query(getuserQuery, [userId]);

    // first checking if userId exist or not
    if (!userInfo.rowCount) {
      return res.status(404).json({ error: "userId do not exist" });
    }
    res.status(200).json(userInfo.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
