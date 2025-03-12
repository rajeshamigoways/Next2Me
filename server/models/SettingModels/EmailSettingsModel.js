const mongoose = require("mongoose");

const EmailTemplateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  variables: { type: [String], default: [] }
}, { timestamps: true });

const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);
module.exports = EmailTemplate;
