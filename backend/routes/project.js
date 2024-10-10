const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().populate('rooms');
    res.json(projects);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Define other routes (e.g., CRUD operations)

module.exports = router;
