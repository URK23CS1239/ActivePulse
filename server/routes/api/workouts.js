const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  exerciseName: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    lowercase: true,
    enum: ['cardio', 'strength', 'flexibility', 'balance', 'sports', 'other'],
    default: 'cardio'
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  caloriesBurned: {
    type: Number,
    default: 0,
    min: [0, 'Calories cannot be negative']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Workout', workoutSchema);
EOF
