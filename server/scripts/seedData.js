require('dotenv').config();
const mongoose = require('mongoose');
const Class = require('../models/class');
const Workout = require('../models/Workout');

const sampleClasses = [
  {
    name: 'Morning Yoga Flow',
    description: 'Start your day with energizing yoga sequences',
    trainer: 'Sarah Johnson',
    type: 'yoga',
    schedule: {
      day: 'Monday',
      time: '07:00',
      duration: 60
    },
    maxParticipants: 20,
    currentParticipants: 12,
    price: 15
  },
  {
    name: 'HIIT Blast',
    description: 'High-intensity interval training for maximum results',
    trainer: 'Mike Thompson',
    type: 'hiit',
    schedule: {
      day: 'Wednesday',
      time: '18:00',
      duration: 45
    },
    maxParticipants: 15,
    currentParticipants: 8,
    price: 20
  },
  {
    name: 'Zumba Party',
    description: 'Dance your way to fitness',
    trainer: 'Elena Rodriguez',
    type: 'zumba',
    schedule: {
      day: 'Friday',
      time: '17:30',
      duration: 60
    },
    maxParticipants: 25,
    currentParticipants: 15,
    price: 12
  }
];

const sampleWorkouts = [
  {
    exerciseName: 'Morning Run',
    duration: 30,
    distance: 5,
    calories: 300,
    category: 'cardio',
    notes: 'Great morning run in the park'
  },
  {
    exerciseName: 'Weight Training',
    duration: 45,
    sets: 4,
    reps: 12,
    calories: 250,
    category: 'strength',
    notes: 'Focus on upper body'
  },
  {
    exerciseName: 'Swimming',
    duration: 40,
    distance: 1.5,
    calories: 400,
    category: 'cardio',
    notes: 'Pool laps - improving technique'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Class.deleteMany({});
    await Workout.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample classes
    await Class.insertMany(sampleClasses);
    console.log('Sample classes added');

    // Insert sample workouts
    await Workout.insertMany(sampleWorkouts);
    console.log('Sample workouts added');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();