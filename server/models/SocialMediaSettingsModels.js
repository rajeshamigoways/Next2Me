const mongoose = require("mongoose");

const SocialMediaSchema = new mongoose.Schema({
  facebook: { type: String, default: null },
  twitter: { type: String, default: null },
  instagram: { type: String, default: null },
  youtube: { type: String, default: null },
  pinterest: { type: String, default: null },
  linkedin: { type: String, default: null },
  snapchat: { type: String, default: null },
  discord: { type: String, default: null },
  reddit: { type: String, default: null },
  telegram: { type: String, default: null },
  whatsapp: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("SocialMedia", SocialMediaSchema);
