require('dotenv').config();
const mongoose = require('mongoose');
const Workout = require('../models/Workout');

const sampleWorkouts = [
    {
        exerciseName: 'Morning Run',
        category: 'cardio',
        duration: 30,
        caloriesBurned: 300,
        distance: 5, // 5 km
        notes: 'Easy pace run around the park',
        date: new Date()
    },
    {
        exerciseName: 'Bench Press',
        category: 'strength',
        sets: 4,
        reps: 10,
        weight: 60, // 60 kg
        caloriesBurned: 250,
        notes: 'Chest workout',
        date: new Date()
    },
    {
        exerciseName: 'Cycling',
        category: 'cardio',
        duration: 60,
        caloriesBurned: 450,
        distance: 20, // 20 km
        notes: 'Interval training on stationary bike',
        date: new Date()
    },
    {
        exerciseName: 'Yoga Flow',
        category: 'flexibility',
        duration: 40,
        caloriesBurned: 150,
        notes: 'Focus on stretching and balance',
        date: new Date()
    }
];

async function seedWorkouts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/activepulse');
        console.log('Connected to MongoDB');

        // Clear existing workouts
        await Workout.deleteMany({});
        console.log('Cleared existing workouts');

        // Insert sample workouts
        await Workout.insertMany(sampleWorkouts);
        console.log('Sample workouts added successfully');

    } catch (error) {
        console.error('Error seeding workouts:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

seedWorkouts();