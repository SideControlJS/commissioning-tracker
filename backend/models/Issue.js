const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  description: String,
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
  assignedTo: String, // Team member or department
  status: { type: String, enum: ['open', 'in progress', 'resolved'], default: 'open' },
  comments: [String],
  createdAt: { type: Date, default: Date.now },
  resolvedAt: Date,
});

module.exports = mongoose.model('Issue', IssueSchema);
