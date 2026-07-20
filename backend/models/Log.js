const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  username: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);