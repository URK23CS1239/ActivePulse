require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for creating test user');

    const existing = await User.findOne({ email: 'tester@example.com' });
    if (existing) {
      console.log('Test user already exists:', existing._id.toString());
      const token = jwt.sign({ userId: existing._id }, process.env.JWT_SECRET || 'temporary_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
      console.log('token:', token);
      process.exit(0);
    }

    const user = new User({ name: 'Tester', email: 'tester@example.com', password: 'Password1' });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'temporary_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
    console.log('Created user id:', user._id.toString());
    console.log('token:', token);
    process.exit(0);
  } catch (err) {
    console.error('Error creating test user:', err);
    process.exit(1);
  }
};

createUser();
