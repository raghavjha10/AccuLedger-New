const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");

// GET user info/settings by email
router.get("/email/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        darkMode: user.darkMode,
        notifications: user.notifications,
        twoFA: user.twoFA,
        backup: user.backup
      }
    });
  } catch (err) {
    console.error("Error fetching user settings:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST update user settings and/or password
router.post("/update", async (req, res) => {
  const { email, name, password, darkMode, notifications, twoFA, backup } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const updateData = {
      darkMode: !!darkMode,
      notifications: !!notifications,
      twoFA: !!twoFA,
      backup: !!backup
    };

    if (name && name.trim() !== "") {
      updateData.name = name;
    }

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Settings updated successfully"
    });

  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
