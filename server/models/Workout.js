// server/models/Workout.js
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  exerciseName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'balance'],
    required: true
  },
  sets: Number,
  reps: Number,
  duration: Number, // in minutes
  caloriesBurned: Number,
  distance: Number, // for cardio
  weight: Number, // for strength training
  notes: String,
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);