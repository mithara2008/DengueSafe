const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  district: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  cases: { type: Number, default: 0 },
  risk: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
  predictedNextWeek: { type: Number, default: 0 },
  rainfall: { type: String },
  temperature: { type: String },
  trend: { type: String, default: '→' },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Case', caseSchema);
