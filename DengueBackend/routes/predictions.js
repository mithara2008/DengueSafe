const express = require('express');
const router = express.Router();

router.get('/predictions', async (req, res) => {
  try {
    const predictions = [
      {
        district: 'Colombo',
        currentCases: 342,
        predictedCases: 380,
        riskLevel: 'High',
        confidence: '87%',
        factors: ['Heavy rainfall', 'High temperature', 'Urban density'],
        recommendation: 'Take immediate preventive action',
      },
      {
        district: 'Gampaha',
        currentCases: 218,
        predictedCases: 245,
        riskLevel: 'High',
        confidence: '82%',
        factors: ['Moderate rainfall', 'Stagnant water reports'],
        recommendation: 'Monitor closely and take precautions',
      },
      {
        district: 'Kandy',
        currentCases: 156,
        predictedCases: 160,
        riskLevel: 'Medium',
        confidence: '75%',
        factors: ['Seasonal patterns', 'Historical data'],
        recommendation: 'Stay alert and follow prevention tips',
      },
    ];
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;