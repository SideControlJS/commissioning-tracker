const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  status: { type: String, enum: ['untested', 'in progress', 'complete'], default: 'untested' },
});

module.exports = mongoose.model('Room', RoomSchema);
