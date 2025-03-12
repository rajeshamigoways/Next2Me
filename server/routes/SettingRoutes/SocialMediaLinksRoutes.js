const express = require("express");
const SocialMedia = require("../../models/SettingModels/SocialMediaSettingsModels");

const router = express.Router();

// Get Social Media Links
router.get("/", async (req, res) => {
  try {
    const socialLinks = await SocialMedia.findOne();
    if (!socialLinks) {
      return res.status(200).json({ message: "No social media links found.", data: {} });
    }
    res.status(200).json(socialLinks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update or Create Social Media Links
router.put("/", async (req, res) => {
  try {
    const { facebook, twitter, instagram, youtube, pinterest, linkedin, snapchat, discord, reddit, telegram, whatsapp } = req.body;

    const updateData = {
      facebook: facebook || null,
      twitter: twitter || null,
      instagram: instagram || null,
      youtube: youtube || null,
      pinterest: pinterest || null,
      linkedin: linkedin || null,
      snapchat: snapchat || null,
      discord: discord || null,
      reddit: reddit || null,
      telegram: telegram || null,
      whatsapp: whatsapp || null,
    };

    let socialLinks = await SocialMedia.findOne();

    if (socialLinks) {
      // Update existing record
      socialLinks = await SocialMedia.findByIdAndUpdate(socialLinks._id, updateData, { new: true });
      return res.status(200).json({ message: "Social media links updated!", data: socialLinks });
    } else {
      // Create new record
      const newSocialLinks = new SocialMedia(updateData);
      await newSocialLinks.save();
      return res.status(201).json({ message: "Social media links created!", data: newSocialLinks });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
