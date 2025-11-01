const express = require('express');
const router = express.Router();
const Class = require('../../models/class.js');
const Workout = require('../../models/Workout');

// Get Dashboard Overview
router.get('/overview', async (req, res) => {
  try {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalClasses,
      totalWorkouts,
      recentClasses,
      recentWorkouts
    ] = await Promise.all([
      Class.countDocuments(),
      Workout.countDocuments(),
      Class.find({ createdAt: { $gte: lastWeek } }).count(),
      Workout.find({ createdAt: { $gte: lastWeek } }).count()
    ]);

    res.json({
      overview: {
        totalClasses,
        totalWorkouts,
        recentClasses,
        recentWorkouts,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ message: 'Error fetching dashboard overview' });
  }
});

// Get all classes with stats
router.get('/classes', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    const skip = (page - 1) * limit;

    const [classes, total] = await Promise.all([
      Class.find()
        .sort({ [sort]: order })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Class.countDocuments()
    ]);

    // Add participant stats
    const classesWithStats = classes.map(c => ({
      ...c,
      capacityPercentage: Math.round((c.currentParticipants / c.maxParticipants) * 100),
      status: c.currentParticipants >= c.maxParticipants ? 'full' : 'available'
    }));

    res.json({
      classes: classesWithStats,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasMore: skip + classes.length < total
    });
  } catch (error) {
    console.error('Admin classes error:', error);
    res.status(500).json({ message: 'Error fetching classes' });
  }
});

// Update class
router.patch('/classes/:id', async (req, res) => {
  try {
    const updates = req.body;
    const classId = req.params.id;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({
      message: 'Class updated successfully',
      class: updatedClass
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Error updating class' });
  }
});

// Delete class
router.delete('/classes/:id', async (req, res) => {
  try {
    const classId = req.params.id;
    const deletedClass = await Class.findByIdAndDelete(classId);

    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({
      message: 'Class deleted successfully',
      class: deletedClass
    });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Error deleting class' });
  }
});

// Get workouts with stats
router.get('/workouts', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    const skip = (page - 1) * limit;

    const [workouts, total] = await Promise.all([
      Workout.find()
        .sort({ [sort]: order })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()
        .populate('user', 'username'),
      Workout.countDocuments()
    ]);

    res.json({
      workouts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasMore: skip + workouts.length < total
    });
  } catch (error) {
    console.error('Admin workouts error:', error);
    res.status(500).json({ message: 'Error fetching workouts' });
  }
});

// Delete workout
router.delete('/workouts/:id', async (req, res) => {
  try {
    const workoutId = req.params.id;
    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);

    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({
      message: 'Workout deleted successfully',
      workout: deletedWorkout
    });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ message: 'Error deleting workout' });
  }
});

module.exports = router;