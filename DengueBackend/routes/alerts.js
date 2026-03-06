const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

router.get('/alerts', async (req, res) => {
  try {
    let alerts = await Alert.find().sort({ createdAt: -1 });
    if (alerts.length === 0) {
      alerts = [
        {
          id: 1,
          type: 'prediction',
          title: 'Dengue Risk May Increase',
          message: 'Based on recent rainfall and temperature data, dengue cases in Colombo district may increase over the next 7 days. Please take preventive measures.',
          district: 'Colombo',
          risk: 'High',
          time: '2 hours ago',
          icon: '📈',
          tips: ['Remove stagnant water', 'Use mosquito repellent', 'Wear long sleeves'],
        },
        {
          id: 2,
          type: 'prediction',
          title: 'Elevated Risk Forecast',
          message: 'Environmental conditions in Gampaha suggest a possible rise in mosquito activity.',
          district: 'Gampaha',
          risk: 'High',
          time: '5 hours ago',
          icon: '⚠️',
          tips: ['Check water containers', 'Use bed nets at night'],
        },
        {
          id: 3,
          type: 'awareness',
          title: 'Weekly Prevention Reminder',
          message: 'This week focus on checking and emptying containers that may hold water.',
          district: 'All Districts',
          risk: 'Info',
          time: '2 days ago',
          icon: '💡',
          tips: ['Inspect flower pots', 'Check roof gutters'],
        },
      ];
    }
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;