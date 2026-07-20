const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['Purchase', 'Transfer', 'Assignment', 'Expenditure'], required: true },
  fromBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', default: null },
  toBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', default: null },
  equipmentType: { type: String, enum: ['Vehicle', 'Weapon', 'Ammunition'], required: true },
  quantity: { type: Number, required: true },
  personnel: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);