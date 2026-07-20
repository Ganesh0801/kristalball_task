const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Asset = require('../models/Asset');
const { auditLogger } = require('../middleware/logger');

router.post('/purchase', auth(['Admin', 'Logistics Officer']), async (req, res) => {
  const { baseId, equipmentType, quantity } = req.body;
  const qtyNum = Number(quantity);
  
  try {
    const tx = await Transaction.create({ type: 'Purchase', toBase: baseId, equipmentType, quantity: qtyNum });
    
    let asset = await Asset.findOne({ baseId, equipmentType });
    if (!asset) {
      asset = new Asset({ baseId, equipmentType, openingBalance: 0 });
    }
    
    asset.purchases += qtyNum;
    asset.closingBalance += qtyNum;
    await asset.save();

    await auditLogger(req, 'ASSET_PURCHASE', { baseId, equipmentType, quantity: qtyNum });
    res.json(tx);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

router.post('/transfer', auth(['Admin', 'Logistics Officer']), async (req, res) => {
  const { fromBase, toBase, equipmentType, quantity } = req.body;
  const qtyNum = Number(quantity);

  if (fromBase === toBase) {
    return res.status(400).json({ msg: 'Source and destination base cannot be the same.' });
  }

  try {
    let srcAsset = await Asset.findOne({ baseId: fromBase, equipmentType });
    if (!srcAsset || srcAsset.closingBalance < qtyNum) {
      return res.status(400).json({ msg: 'Insufficient inventory metrics at source base.' });
    }

    const tx = await Transaction.create({ type: 'Transfer', fromBase, toBase, equipmentType, quantity: qtyNum });

    srcAsset.transfersOut += qtyNum;
    srcAsset.closingBalance -= qtyNum;
    await srcAsset.save();

    let destAsset = await Asset.findOne({ baseId: toBase, equipmentType });
    if (!destAsset) {
      destAsset = new Asset({ baseId: toBase, equipmentType, openingBalance: 0 });
    }
    
    destAsset.transfersIn += qtyNum;
    destAsset.closingBalance += qtyNum;
    await destAsset.save();

    await auditLogger(req, 'ASSET_TRANSFER', { fromBase, toBase, equipmentType, quantity: qtyNum });
    res.json(tx);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

router.post('/assign-expend', auth(['Admin', 'Base Commander']), async (req, res) => {
  const { baseId, equipmentType, quantity, type, personnel } = req.body;
  const qtyNum = Number(quantity);

  try {
    let asset = await Asset.findOne({ baseId, equipmentType });
    if (!asset || asset.closingBalance < qtyNum) {
      return res.status(400).json({ msg: 'Operation blocked. Insufficient deployment balance.' });
    }

    const tx = await Transaction.create({ type, fromBase: baseId, equipmentType, quantity: qtyNum, personnel });

    if (type === 'Assignment') {
      asset.assigned += qtyNum;
      asset.closingBalance -= qtyNum;
    } else if (type === 'Expenditure') {
      asset.expended += qtyNum;
      asset.closingBalance -= qtyNum;
    }
    await asset.save();

    await auditLogger(req, `ASSET_${type.toUpperCase()}`, { baseId, equipmentType, quantity: qtyNum, personnel });
    res.json(tx);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/history', auth(), async (req, res) => {
  try {
    const { type } = req.query;
    let filter = {};
    if (type) filter.type = type;
    
    const history = await Transaction.find(filter)
      .populate('fromBase toBase')
      .sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;