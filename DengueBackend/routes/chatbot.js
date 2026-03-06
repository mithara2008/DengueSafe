const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content: `You are DengueSafe Assistant, a helpful health assistant 
            specialized in dengue and chikungunya disease prevention in Sri Lanka.
            You help users with:
            - Dengue and chikungunya symptoms
            - Prevention tips specific to Sri Lanka
            - High risk districts and outbreak information
            - When to see a doctor
            - Mosquito breeding site removal
            Current high risk districts: Colombo, Gampaha, Kalutara
            Medium risk: Kandy, Kurunegala, Ratnapura
            Low risk: Galle, Matara, Jaffna
            Always respond in a friendly, clear way.
            Keep responses concise under 150 words.
            You can respond in English, Sinhala, or Tamil based on user language.
            If asked about something unrelated to dengue/health, politely redirect.`
          },
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
    console.log('Chatbot error full:', err.response?.data);
    console.log('Chatbot error status:', err.response?.status);
    console.log('Chatbot error message:', err.message);
    res.status(500).json({
      message: 'Chatbot error',
      error: err.response?.data || err.message
    });
  }
});

module.exports = router;