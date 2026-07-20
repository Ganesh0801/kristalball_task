const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Asset = require('../models/Asset');
const Base = require('../models/Base');

router.get('/dashboard', auth(), async (req, res) => {
  try {
    const { baseId, equipmentType } = req.query;
    let query = {};

    if (req.user.role === 'Base Commander') {
      query.baseId = req.user.baseId;
    } else if (baseId) {
      query.baseId = baseId;
    }

    if (equipmentType) {
      query.equipmentType = equipmentType;
    }

    const assets = await Asset.find(query).populate('baseId');
    
    let summary = {
      openingBalance: 0,
      purchases: 0,
      transfersIn: 0,
      transfersOut: 0,
      assigned: 0,
      expended: 0,
      closingBalance: 0
    };

    assets.forEach(asset => {
      summary.openingBalance += asset.openingBalance;
      summary.purchases += asset.purchases;
      summary.transfersIn += asset.transfersIn;
      summary.transfersOut += asset.transfersOut;
      summary.assigned += asset.assigned;
      summary.expended += asset.expended;
      summary.closingBalance += asset.closingBalance;
    });

    res.json({ summary, assets });
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/bases', auth(), async (req, res) => {
  try {
    const bases = await Base.find();
    res.json(bases);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;