require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/admin');

const createInitialAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const adminExists = await Admin.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new Admin({
      username: 'admin',
      password: 'admin123',  // This will be hashed automatically
      email: 'admin@activepulse.com'
    });

    await admin.save();
    console.log('Initial admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createInitialAdmin();