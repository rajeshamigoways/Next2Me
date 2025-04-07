const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

/**
 * Generates a JWT token.
 * @param {string} userId - The ID of the user.
 * @param {string} expiresIn - Token expiration time (default: "1h").
 * @returns {string} - JWT token.
 */
const generateToken = (userId, expiresIn = "1h") => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn });
};

/**
 * Verifies a JWT token.
 * @param {string} token - The token to verify.
 * @returns {object} - Decoded token data.
 * @throws {Error} - If token is invalid or expired.
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Sends an email using Nodemailer.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} html - Email body content in HTML format.
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed.");
  }
};

module.exports = { generateToken, verifyToken, sendEmail };
