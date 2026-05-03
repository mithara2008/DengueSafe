const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema({
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    violationType: { type: String, required: true },
    fineAmount: { type: Number, required: true },
    notes: { type: String },
    officerName: { type: String },
    officerBadge: { type: String },
    status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
    emailSent: { type: Boolean, default: false },
    imageBase64: { type: String },
    imageUrl: { type: String },
    issuedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Violation", violationSchema);