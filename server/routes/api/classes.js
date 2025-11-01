const express = require('express');
const router = express.Router();
const Class = require('../../models/class.js');

// Get all classes with stats
router.get('/', async (req, res) => {
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
      capacityPercentage: Math.round((c.currentParticipants || 0) / c.maxParticipants * 100),
      status: (c.currentParticipants || 0) >= c.maxParticipants ? 'full' : 'available'
    }));

    res.json({
      classes: classesWithStats,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasMore: skip + classes.length < total
    });
  } catch (error) {
    console.error('Classes fetch error:', error);
    res.status(500).json({ message: 'Error fetching classes' });
  }
});

// Create a new class
router.post('/', async (req, res) => {
  try {
    const { name, description, trainer, type, schedule, maxParticipants, price } = req.body;

    // Validate required fields
    if (!name || !trainer || !type || !schedule || !maxParticipants) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate schedule
    if (!schedule.day || !schedule.time || !schedule.duration) {
      return res.status(400).json({ message: 'Invalid schedule information' });
    }

    const classData = new Class({
      name: name.trim(),
      description: description ? description.trim() : '',
      trainer: trainer.trim(),
      type,
      schedule: {
        day: schedule.day,
        time: schedule.time,
        duration: Math.max(1, parseInt(schedule.duration))
      },
      maxParticipants: Math.max(1, parseInt(maxParticipants)),
      price: price ? Math.max(0, parseFloat(price)) : 0,
      currentParticipants: 0,
      registeredUsers: []
    });

    const newClass = await classData.save();
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Invalid class data', details: error.message });
    } else {
      res.status(500).json({ message: 'Failed to create class' });
    }
  }
});

// Update a class
router.patch('/:id', async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a class
router.delete('/:id', async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for a class (no auth required for demo)
router.post('/:id/register', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (classItem.currentParticipants >= classItem.maxParticipants) {
      return res.status(400).json({ message: 'Class is full' });
    }

    // Just increment the participant count for demo
    classItem.currentParticipants = (classItem.currentParticipants || 0) + 1;
    await classItem.save();

    res.json({ 
      message: 'Successfully registered for class', 
      class: classItem,
      capacityPercentage: Math.round(classItem.currentParticipants / classItem.maxParticipants * 100),
      status: classItem.currentParticipants >= classItem.maxParticipants ? 'full' : 'available'
    });
  } catch (error) {
    console.error('Class registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;