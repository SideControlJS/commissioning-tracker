const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const Room = require('../models/Room');
const Equipment = require('../models/Equipment');

// Get all issues for a project
router.get('/projects/:projectId/issues', async (req, res) => {
  try {
    const { projectId } = req.params;
    const rooms = await Room.find({ project: projectId });
    const roomIds = rooms.map(room => room._id);
    const issues = await Issue.find({ room: { $in: roomIds } });
    res.json(issues);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Create a new issue for a project
router.post('/projects/:projectId/issues', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { description, room, equipment, assignedTo, status } = req.body;

    const roomDoc = await Room.findOne({ roomNumber: room, project: projectId });
    if (!roomDoc) return res.status(400).send('Room not found');

    let equipmentDoc = null;
    if (equipment) {
      equipmentDoc = await Equipment.findOne({ serialNumber: equipment, room: roomDoc._id });
      if (!equipmentDoc) return res.status(400).send('Equipment not found in the specified room');
    }

    const newIssue = new Issue({
      description,
      room: roomDoc._id,
      equipment: equipmentDoc ? equipmentDoc._id : null,
      assignedTo,
      status,
    });

    await newIssue.save();
    res.status(201).json(newIssue);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Define other CRUD routes for issues as needed

module.exports = router;
