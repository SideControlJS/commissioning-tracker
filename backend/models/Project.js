const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: String,
  type: String, // e.g., Restaurant, Guest Room Management
  startDate: Date,
  endDate: Date,
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
});

module.exports = mongoose.model('Project', ProjectSchema);
