const express = require('express');
const router = express.Router();
const axios = require('axios');
const Case = require('../models/Case');
const Alert = require('../models/Alert');

router.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    // 1. Fetch Dynamic Context from DB
    const topDistricts = await Case.find().sort({ cases: -1 }).limit(5);
    const recentAlerts = await Alert.find().sort({ createdAt: -1 }).limit(3);

    const districtContext = topDistricts.map(d =>
      `${d.district}: ${d.cases} cases, ${d.risk} Risk (${d.trend} trend)`
    ).join('\n');

    const alertContext = recentAlerts.map(a =>
      `- ${a.title} (${a.district}): ${a.message}`
    ).join('\n');

    // 2. Deep Personality & Data Awareness
    const systemPrompt = `You are DengueSafe AI - the official Health & Prevention Specialist for Sri Lanka.

CORE KNOWLEDGE (REAL-TIME DATA):
Current High Case Districts:
${districtContext || "Data pending..."}

Recent Health Alerts:
${alertContext || "No active alerts."}

RULES:
1. PERSONALITY: Professional yet empathetic. You represent the Sri Lankan health ministry's digital arm.
2. HYPER-LOCAL: Mention specific cleaning tips for Sri Lankan homes (cleaning 'poth' / clay pots, checking 'paththara' / newspapers, tire storage).
3. EMERGENCY: If a user mentions high fever (over 101F), bleeding, or severe abdominal pain, you MUST start your reply with 🚨 EMERGENCY WARNING: Contact Suwa Seriya (1990) or go to the nearest hospital immediately.
4. DATA USAGE: Use the "Current High Case Districts" provided above to answer questions about risk levels.
5. CONCISENESS: Keep answers under 150 words.
6. LANGUAGE: Respond in the language the user used (Sinhala, Tamil, or English).`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        max_tokens: 800,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error('Chatbot Error:', err.message);
    res.status(500).json({
      message: 'Chatbot error',
      error: err.message
    });
  }
});

module.exports = router;