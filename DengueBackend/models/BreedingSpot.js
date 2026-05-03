const mongoose = require("mongoose");

const breedingSpotSchema = new mongoose.Schema({
    district: { type: String, required: true },
    address: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    spotType: { type: String, required: true },
    description: { type: String },
    imageBase64: { type: String },
    imageUrl: { type: String },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    officerName: { type: String },
    status: { type: String, enum: ['active', 'cleared', 'pending'], default: 'active' },
    recordedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BreedingSpot", breedingSpotSchema);