const express = require('express');
const router = express.Router();
const Case = require('../models/Case');

// Get all heatmap data
router.get('/heatmap', async (req, res) => {
  try {
    let cases = await Case.find();
    // If no data in DB, return mock data
    if (cases.length === 0) {
      cases = [
        { district: 'Colombo', latitude: 6.9271, longitude: 79.8612, cases: 342, risk: 'High', color: '#D32F2F', radius: 8000, predictedNextWeek: 380, trend: '↑', rainfall: '245mm', temp: '31°C' },
        { district: 'Gampaha', latitude: 7.0917, longitude: 79.9997, cases: 218, risk: 'High', color: '#D32F2F', radius: 7000, predictedNextWeek: 245, trend: '↑', rainfall: '198mm', temp: '30°C' },
        { district: 'Kalutara', latitude: 6.5854, longitude: 79.9607, cases: 178, risk: 'High', color: '#D32F2F', radius: 6500, predictedNextWeek: 190, trend: '↑', rainfall: '210mm', temp: '30°C' },
        { district: 'Kandy', latitude: 7.2906, longitude: 80.6337, cases: 156, risk: 'Medium', color: '#F9A825', radius: 6000, predictedNextWeek: 160, trend: '→', rainfall: '156mm', temp: '27°C' },
        { district: 'Kurunegala', latitude: 7.4863, longitude: 80.3647, cases: 134, risk: 'Medium', color: '#F9A825', radius: 5500, predictedNextWeek: 140, trend: '→', rainfall: '145mm', temp: '29°C' },
        { district: 'Ratnapura', latitude: 6.7056, longitude: 80.3847, cases: 98, risk: 'Medium', color: '#F9A825', radius: 5000, predictedNextWeek: 95, trend: '↓', rainfall: '320mm', temp: '28°C' },
        { district: 'Galle', latitude: 6.0535, longitude: 80.2210, cases: 89, risk: 'Low', color: '#388E3C', radius: 4000, predictedNextWeek: 85, trend: '↓', rainfall: '178mm', temp: '29°C' },
        { district: 'Matara', latitude: 5.9549, longitude: 80.5550, cases: 67, risk: 'Low', color: '#388E3C', radius: 3500, predictedNextWeek: 60, trend: '↓', rainfall: '165mm', temp: '29°C' },
        { district: 'Jaffna', latitude: 9.6615, longitude: 80.0255, cases: 45, risk: 'Low', color: '#388E3C', radius: 3000, predictedNextWeek: 50, trend: '→', rainfall: '67mm', temp: '32°C' },
      ];
    }
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update case data (Mental Entry by PHI)
router.post('/update-cases', async (req, res) => {
  try {
    const { district, cases } = req.body;
    if (!district || cases === undefined) {
      return res.status(400).json({ message: 'District and cases are required' });
    }

    // Find and update or create
    const updatedCase = await Case.findOneAndUpdate(
      { district },
      { $set: { cases: parseInt(cases), updatedAt: new Date() } },
      { new: true, upsert: true }
    );

    res.json({ message: 'Data updated successfully', updatedCase });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;