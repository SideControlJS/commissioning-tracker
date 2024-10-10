const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  serialNumber: String,
  type: String, // e.g., Light, Dimmer
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  status: { type: String, enum: ['in-use', 'RMA', 'replaced'], default: 'in-use' },
  rmaInfo: {
    replacementSerialNumber: String,
    movedFromRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  },
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
