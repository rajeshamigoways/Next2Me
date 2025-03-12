const express = require("express");
const Admin = require("../models/UserLogin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// **Nodemailer Transporter Setup**
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// **Check Admin Email**
router.post("/checkmail", async (req, res) => {
  const { email } = req.body;


  try {
    const admin = await Admin.findOne({ $or: [{ username: email }, { email: email }] });

    if (!admin) {
      return res.status(400).json({ message: "Email or Username not found or not an admin." });
    }

    const resetToken = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1h" });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: "Password Reset Request",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          
          <p style="color: #555;">Hi <strong>${admin.username || admin.email}</strong>,</p>
          <p style="color: #555;">We received a request to reset your password. Click the button below to set a new password:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" 
              style="display: inline-block; padding: 12px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px;">If you didn't request this, you can ignore this email.</p>
          <p style="color: #777; font-size: 14px;">This link will expire in <strong>24 hours</strong>.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
     
        return res.status(500).json({ message: "Error sending email" });
      }
     
    });

    res.status(200).json({ message: "Check your email for the password reset link." });

  } catch (error) {
    console.error("Error during email check:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// **Verify Reset Token**
router.get("/verify-token/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ message: "Invalid or expired token." });
    }

    res.status(200).json({ message: "Valid token." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
});

// **Reset Password**
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    admin.password = password;
    await admin.save();

    res.status(200).json({ message: "Password successfully reset." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
});


module.exports = router;
