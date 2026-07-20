const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  equipmentType: { type: String, enum: ['Vehicle', 'Weapon', 'Ammunition'], required: true },
  openingBalance: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  transfersIn: { type: Number, default: 0 },
  transfersOut: { type: Number, default: 0 },
  assigned: { type: Number, default: 0 },
  expended: { type: Number, default: 0 },
  closingBalance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Asset', AssetSchema);