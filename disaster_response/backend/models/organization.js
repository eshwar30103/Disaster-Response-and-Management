// backend/models/Organization.js (updated)
const mongoose = require('mongoose');
const { hashPassword } = require('../utils/auth'); // Import hashPassword utility

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  services: { type: [String], required: true },
  password: { type: String, required: true }, // Add password field
});

// Hash password before saving
organizationSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});

module.exports = mongoose.model('Organization', organizationSchema);