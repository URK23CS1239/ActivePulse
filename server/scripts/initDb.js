require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Class = require('../models/class');

const initializeDb = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create admin user
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@activepulse.com',
            password: 'Admin@123',
            isAdmin: true
        });
        await adminUser.save();
        console.log('Admin user created');

        // Create sample workouts
        const sampleWorkouts = [
            {
                name: 'Morning Run',
                type: 'Cardio',
                duration: 30,
                caloriesBurned: 300
            },
            {
                name: 'Weight Training',
                type: 'Strength',
                duration: 45,
                caloriesBurned: 200
            }
        ];
        await Workout.insertMany(sampleWorkouts);
        console.log('Sample workouts created');

        // Create sample classes
        const sampleClasses = [
            {
                name: 'Yoga Basics',
                instructor: 'Sarah Johnson',
                schedule: 'Monday, Wednesday 9:00 AM',
                capacity: 20
            },
            {
                name: 'HIIT Challenge',
                instructor: 'Mike Thompson',
                schedule: 'Tuesday, Thursday 5:30 PM',
                capacity: 15
            }
        ];
        await Class.insertMany(sampleClasses);
        console.log('Sample classes created');

        console.log('Database initialization completed');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await mongoose.disconnect();
    }
};

initializeDb();