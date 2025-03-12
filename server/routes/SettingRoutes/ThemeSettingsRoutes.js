const ThemeSettings= require("../../models/SettingModels/ThemeSettingsModels")
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const saveThemeSettings = async (req, res) => {
  try {
    const {
      sitename,
      systemFont,
      sidebarTheme,
      themeColor,
      topBarColor,
      loginTitle,
      logoType
    } = req.body;

    // Access uploaded files (handling cases where files may not be uploaded)
    const companyLogo = req.files?.companyLogo ? req.files.companyLogo[0].filename : null;
    const favicon = req.files?.favicon ? req.files.favicon[0].filename : null;
    const appleIcon = req.files?.appleIcon ? req.files.appleIcon[0].filename : null;

    // Create new theme settings document
    const newSettings = new ThemeSettings({
      site_name: sitename,
      system_font: systemFont,
      sidebar_theme: sidebarTheme,
      theme_color: themeColor,
      topBar_color: topBarColor,
      login_title: loginTitle,
      logo_type: logoType,
      company_logo: companyLogo,
      favicon: favicon,
      appleIcon: appleIcon
    });

    // Save to database
    await newSettings.save();

    res.status(200).json({
      message: 'Theme settings saved successfully!',
      data: newSettings
    });
  } catch (err) {
    console.error('Error saving theme settings:', err);
    res.status(500).json({ error: 'Failed to save theme settings' });
  }
};

  
const upload = multer({ storage });

// POST route to save theme settings
router.post('/', upload.fields([
  { name: 'companyLogo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 },
  { name: 'appleIcon', maxCount: 1 },
]), saveThemeSettings);

module.exports = router;
