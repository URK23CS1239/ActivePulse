// server/routes/api/workouts.js
const express = require('express');
const Workout = require('../../models/Workout');
const router = express.Router();

// NOTE: Authentication was removed to allow the app to work without login
// For production, re-enable auth and scope queries to a userId

// Get all workouts with pagination and stats
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'date', order = 'desc' } = req.query;
    const skip = (page - 1) * limit;

    const [workouts, total] = await Promise.all([
      Workout.find()
        .sort({ [sort]: order })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Workout.countDocuments()
    ]);

    // Add some stats to each workout
    const workoutsWithStats = workouts.map(w => ({
      ...w,
      caloriesPerMinute: w.caloriesBurned / w.duration,
      intensity: w.caloriesBurned > 300 ? 'high' : w.caloriesBurned > 150 ? 'medium' : 'low'
    }));

    res.json({
      workouts: workoutsWithStats,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasMore: skip + workouts.length < total
    });
  } catch (error) {
    console.error('Workouts fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create workout
router.post('/', async (req, res) => {
  try {
    const workout = await Workout.create({
      ...req.body
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update workout
router.put('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete workout
router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get workout statistics (global)
router.get('/stats', async (req, res) => {
  try {
    const stats = await Workout.aggregate([
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalCalories: { $sum: '$caloriesBurned' },
          totalDuration: { $sum: '$duration' },
          avgDuration: { $avg: '$duration' }
        }
      }
    ]);

    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;