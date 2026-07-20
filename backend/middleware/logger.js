const Log = require('../models/Log');

const auditLogger = async (req, action, details) => {
  try {
    await Log.create({
      userId: req.user?.id || null,
      username: req.user?.username || 'System',
      action,
      details
    });
  } catch (err) {
    console.error('System Error: Audit logging operation failed:', err);
  }
};

module.exports = { auditLogger };