const express = require("express");
const User = require("../models/UserLogin");
const adminUser=require("../models/SuperadminModels")
const bcrypt = require("bcryptjs");
const { generateToken, verifyToken, sendEmail } = require("../commonfunction");

const router = express.Router();

// **Check User Email & Send Reset Link**
router.post("/checkmail", async (req, res) => {
  const { email } = req.body;

  try {
    // First check in User collection
    let user = await User.findOne({ $or: [{ username: email }, { email }] });

    // If not found, check in adminUser collection
    if (!user) {
      user = await adminUser.findOne({ $or: [{ username: email }, { email }] });
      if (!user) {
        return res.status(400).json({ message: "Email or Username not found." });
      }
    }

    const resetToken = generateToken(user._id, "1h");
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p style="color: #555;">Hi <strong>${user.username || user.email}</strong>,</p>
        <p style="color: #555;">Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        <p style="color: #777; font-size: 14px;">Link expires in <strong>1 hour</strong>.</p>
        <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Amigoways</p>
      </div>
    `;

    await sendEmail(user.email, "Password Reset Request", emailContent);

    return res.status(200).json({ message: "Check your email for the password reset link." });
  } catch (error) {
    console.error("Error in /checkmail:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify-token/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = verifyToken(token);
    let user = await User.findById(decoded.id);

    if (!user) {
      user = await adminUser.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Invalid or expired token." });
      }
    }

    res.status(200).json({ message: "Valid token." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
});


router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = verifyToken(token);
    let user = await User.findById(decoded.id);

    if (!user) {
      user = await adminUser.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">Password Successfully Reset</h2>
        <p style="color: #555;">Hi <strong>${user.username || user.email}</strong>,</p>
        <p style="color: #555;">Your password has been successfully reset.</p>
        <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Amigoways</p>
      </div>
    `;

    await sendEmail(user.email, "Password Successfully Reset", emailContent);

    res.status(200).json({ message: "Password successfully reset." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
});

module.exports = router;
