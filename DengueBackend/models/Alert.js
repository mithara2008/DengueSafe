const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ['prediction', 'awareness'], default: 'prediction' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  district: { type: String, default: 'All Districts' },
  risk: { type: String, default: 'Medium' },
  icon: { type: String, default: '⚠️' },
  tips: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alert', alertSchema);