const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const Admin = require("../../models/UserLogin");

const router = express.Router();

// Multer setup for avatar upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Update profile details
router.put("/profile", async (req, res) => {
    try {
      const authToken = req.headers.authorization?.split(" ")[1]; // Extract token
      if (!authToken) {
        return res.status(401).json({ message: "Unauthorized access" });
      }
  
      const admin = await Admin.findOne({ authToken }); // Find admin by authToken
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      const { fullName, phone } = req.body;
      admin.username = fullName || admin.username;
      admin.phone = phone || admin.phone;
      await admin.save();
  
      res.json({ message: "Profile updated successfully", admin });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  router.put("/changepassword", async (req, res) => {
    try {
        const authToken = req.headers.authorization?.split(" ")[1]; // Extract token
        if (!authToken) {
          return res.status(401).json({ message: "Unauthorized access" });
        }
    
        const admin = await Admin.findOne({ authToken }); // Find admin by authToken
        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }
  
      const { oldPassword, newPassword } = req.body;
  console.log(oldPassword!==admin.password)

      if(oldPassword!==admin.password){
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      // Check if the old password matches the current password
    //   const isMatch = await bcrypt.compare(oldPassword, admin.password);
    //   if (!isMatch) {
    //     return res.status(400).json({ message: "Old password is incorrect" });
    //   }
  
      // Hash the new password and update it
      admin.password = newPassword
      await admin.save();
  
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  


// Update avatar
router.put("/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const authToken = req.headers.authorization?.split(" ")[1]; // Extract token

        if (!authToken) {
          return res.status(401).json({ message: "Unauthorized access" });
        }
    
        const admin = await Admin.findOne({ authToken }); // Find admin by authToken


        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }
        
        const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;
        admin.avatar = avatarPath;
        await admin.save();
    res.json({ message: "Avatar updated successfully", avatar: avatarPath });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
