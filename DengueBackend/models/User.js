const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  district: { type: String, default: 'Colombo' },
  role: { type: String, default: 'public', enum: ['public', 'officer'] },
  language: { type: String, default: 'English' },
  notifications: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);