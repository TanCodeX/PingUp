const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomName:  { type: String, required: true, index: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username:  { type: String, required: true },
  role:      { type: String, required: true },
  text:      { type: String, required: true },
  deleted:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
