const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/heatmap'));
app.use('/api', require('./routes/alerts'));
app.use('/api', require('./routes/predictions'));
app.use('/api', require('./routes/chatbot'));
app.use('/api/phi', require('./routes/phi'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🦟 DengueSafe API is running!', status: 'OK' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.log('❌ MongoDB Error:', err));