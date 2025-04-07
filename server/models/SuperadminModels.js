// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const superadminSchema = new Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  password: { type: String, required: true },
  role: {
    type: mongoose.Types.ObjectId,
    ref: 'roles', // this should match your Role model name
    required: true
  },
  usertype: { type: String, default: 'user' },
  roleID: String,
  authToken: String,
  address: {
    city: String,
    district: String,
    state: String,
    country: String,
    postalCode: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('super-admin', superadminSchema);
