// server/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'https://active-pulse.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB with retry logic
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/activepulse';
const connectWithRetry = async () => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⏳ Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 MongoDB error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 MongoDB disconnected. Attempting to reconnect...');
  setTimeout(connectWithRetry, 5000);
});

// Initial connection attempt
connectWithRetry();

// Routes
app.use('/api/workouts', require('./routes/api/workouts'));
app.use('/api/classes', require('./routes/api/classes'));

// Quick health/test endpoint
app.get('/api/test', (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ActivePulse API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});