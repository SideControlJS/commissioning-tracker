const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const projectRoutes = require('./routes/project');
const issueRoutes = require('./routes/issues');
const reportRoutes = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/lighting-commissioning')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Make sure each route is used properly
app.use('/api/upload', uploadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

