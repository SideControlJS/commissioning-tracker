const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const projectRoutes = require('./routes/project');
const issueRoutes = require('./routes/issues');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', projectRoutes);
app.use('/api', issueRoutes);

mongoose.connect('mongodb://localhost:27017/lighting-commissioning', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api', uploadRoutes);

// Define other routes as needed

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
