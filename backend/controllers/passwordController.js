const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.resetPassword = async (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).send("User ID and new password are required.");
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await User.findByIdAndUpdate(userId, { password: hashedPassword });

    if (!result) {
      return res.status(404).send("User not found.");
    }

    return res.send("✅ Password updated successfully.");
  } catch (error) {
    console.error("Hashing/Database error:", error);
    return res.status(500).send("Internal server error.");
  }
};
