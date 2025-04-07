// models/SystemSettings.js
const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
  darkMode: {
    type: Boolean,
    default: false
  },
  timezone: {
    type: String,
    required: true,
    default: 'UTC+05:30'
  },
  currency: {
    type: String,
    // required: true,
    default: 'INR'
  },
  currencySymbol: {
    type: String,
    // required: true,
    default: '₹'
  },
  currencyPosition: {
    type: String,
    required: true,
    default: 'before'
  },
  currencyDecimals: {
    type: String,
    required: true,
    default: '2'
  },
  decimalSeparator: {
    type: String,
    required: true,
    default: '.'
  },
  thousandSeparator: {
    type: String,
    required: true,
    default: ','
  },
  taxDecimals: {
    type: String,
    required: true,
    default: '2'
  },
  quantityDecimals: {
    type: String,
    required: true,
    default: '2'
  },
  dateFormat: {
    type: String,
    required: true,
    default: 'MM-DD-YYYY'
  },
  enableLanguages: {
    type: Boolean,
    default: false
  },
  fileSize: {
    type: String,
    required: true,
    default: '80000'
  },
  allowedFiles: {
    type: String,
    required: true,
    default: 'pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif'
  },
  autoClose: {
    type: String,
    required: true,
    default: '30'
  }
}, {
  timestamps: true
});


  
  module.exports = mongoose.model("systemsettings", SystemSettingsSchema);