require('dotenv').config();
const mongoose = require('mongoose');
const Class = require('../models/class');
const Workout = require('../models/Workout');

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Class.deleteMany({});
    await Workout.deleteMany({});
    console.log('Cleared all sample data');

    console.log('Database reset successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();