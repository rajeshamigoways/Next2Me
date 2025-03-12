const mongoose = require('mongoose');

const themeSettingsSchema = new mongoose.Schema({
  site_name: { type: String, required: true },
  system_font: { type: String, required: true },
  sidebar_theme: { type: String, required: true },
  theme_color: { type: String, required: true },
  topBar_color: { type: String, required: true },
  login_title: { type: String, required: true },
  logo_type: { type: String, required: true },
  company_logo: { type: String }, // Store the filename of uploaded logo
  favicon: { type: String }, // Store the filename of uploaded favicon
  appleIcon: { type: String }, // Store the filename of uploaded apple icon
});

const ThemeSettings = mongoose.model('ThemeSettings', themeSettingsSchema);

module.exports = ThemeSettings;

