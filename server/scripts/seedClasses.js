const mongoose = require('mongoose');
require('dotenv').config();
const Class = require('../models/class.js');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/activepulse';

const sampleClasses = [{
  name: 'Power Yoga',
  trainer: 'Sarah Johnson',
  type: 'yoga',
  schedule: {
    day: 'Monday',
    time: '9:00 AM',
    duration: 60
  },
  maxParticipants: 20,
  currentParticipants: 12,
  description: 'Dynamic yoga class focusing on strength and flexibility',
  price: 15,
  isActive: true
},
{
  name: 'HIIT Blast',
  trainer: 'Mike Thompson',
  type: 'hiit',
  schedule: {
    day: 'Tuesday',
    time: '6:00 PM',
    duration: 45
  },
  maxParticipants: 15,
  currentParticipants: 10,
  description: 'High-intensity interval training for maximum calorie burn',
  price: 20,
  isActive: true
},
{
  name: 'Spin Class',
  trainer: 'Emily Chen',
  type: 'cycling',
  schedule: {
    day: 'Thursday',
    time: '7:30 AM',
    duration: 50
  },
  maxParticipants: 25,
  currentParticipants: 15,
  description: 'Energetic cycling session with varying intensity levels',
  price: 18,
  isActive: true
},
{
  name: 'Zumba Party',
  trainer: 'David Wilson',
  type: 'zumba',
  schedule: {
    day: 'Friday',
    time: '5:30 PM',
    duration: 55
  },
  maxParticipants: 30,
  currentParticipants: 20,
  description: 'Fun and energetic dance fitness class',
  price: 15,
  isActive: true
}];

async function seedClasses() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing classes
    await Class.deleteMany({});
    console.log('Cleared existing classes');

    // Insert sample classes
    const result = await Class.insertMany(sampleClasses);
    console.log('Added sample classes:', result.length);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedClasses();