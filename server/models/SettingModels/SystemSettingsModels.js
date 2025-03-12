const mongoose = require("mongoose");
// Define the settings schema
const settingModel = new mongoose.Schema({
    darkMode: { type: Boolean, default: false },
    timezone: { type: String, default: null },
    currency: { type: String, default: null },
    currencySymbol: { type: String, default: null },
    currencyPosition: { type: String, default: null },
    currencyDecimals: { type: Number, default: 2 },
    decimalSeparator: { type: String, default: "." },
    thousandSeparator: { type: String, default: "," },
    taxDecimals: { type: Number, default: 2 },
    quantityDecimals: { type: Number, default: 2 },
    dateFormat: { type: String, default: "YYYY-MM-DD" },
    enableLanguages: { type: Boolean, default: false },
    fileSize: { type: Number, default: 10 },  // Max file size in MB
    allowedFiles: { type: String, default: "jpg, png, pdf" }, // File types allowed
    autoClose: { type: Number, default: 30 }, // Auto close in seconds
  });
  

  
  module.exports = mongoose.model("systemsettings", settingModel);