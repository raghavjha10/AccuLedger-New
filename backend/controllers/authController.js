// ============================
// Auth Controller (MongoDB/Mongoose Version)
// ============================
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Mail Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register User
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).send("❌ All fields are required.");

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("❌ Email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.send("✅ Registered successfully. Please log in.");
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).send("❌ An error occurred during registration.");
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("❌ Email and password are required.");

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send("❌ Invalid email or password");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).send("❌ Invalid email or password");

    res.send("✅ Login successful");
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).send("❌ Server error during login.");
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("❌ Email is required.");

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("❌ Email not found");

    const userId = user._id;
    const referer = req.get("referer") || "http://localhost:5500/frontend/Forgot_Password.html";
    let resetLink;
    if (/Forgot_Password\.html/i.test(referer)) {
      resetLink = referer.replace(/Forgot_Password\.html/i, "Reset_Password.html") + `?id=${userId}`;
    } else {
      try {
        const parsed = new URL(referer);
        resetLink = `${parsed.origin}/Reset_Password.html?id=${userId}`;
      } catch (e) {
        resetLink = `http://localhost:5500/frontend/Reset_Password.html?id=${userId}`;
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔑 Reset Your AccuLedger Password",
      html: `
        <p>Hello ${user.name},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn’t request this, you can ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Mail error:", error);
        // Fallback for hosting environments with blocked SMTP ports (like Render free tier)
        return res.status(200).send(`⚠️ AccuLedger is hosted on Render's free tier (which blocks outbound email ports 465/587 by default). For testing/presentation, here is your password reset link:<br/><br/><a href="${resetLink}" style="color: #007bff; font-weight: 600; text-decoration: underline;">👉 Reset Password Link</a>`);
      }
      console.log("📧 Email sent:", info.response);
      res.send("✅ Reset link sent to your email");
    });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).send("❌ Error checking email");
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword || !id) return res.status(400).send("❗ Required fields missing");

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await User.findByIdAndUpdate(id, { password: hashedPassword });

    if (!result) return res.status(404).send("❌ User not found");
    res.send("✅ Password reset successful");
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).send("❌ Error updating password");
  }
};

// Get User by Email
exports.getUserByEmail = async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email }, "name email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Database error" });
  }
};
