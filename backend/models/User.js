const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Base Commander', 'Logistics Officer'], required: true },
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', default: null }
});

module.exports = mongoose.model('User', UserSchema);