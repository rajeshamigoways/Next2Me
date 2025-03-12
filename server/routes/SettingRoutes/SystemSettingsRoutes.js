const express = require("express");
const Settings = require("../../models/SettingModels/SystemSettingsModels");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      // Fetch the settings from the database
      const settings = await Settings.findOne();
      if (settings) {
        res.status(200).json(settings);
      } else {
        res.status(404).json({ message: "Settings not found" });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Error fetching settings" });
    }
  });
  
  // POST route to update system settings
router.post("/", async (req, res) => {
    try {
      const data = req.body;
  
      // Check if the settings document exists, if not create a new one
      const settings = await Settings.findOneAndUpdate(
        {},
        { $set: data },
        { new: true, upsert: true } // This will insert if not found
      );
  
      res.status(200).json(settings);
    } catch (error) {
      console.error("Error saving settings:", error);
      res.status(500).json({ message: "Error saving settings" });
    }
  });

  module.exports = router;