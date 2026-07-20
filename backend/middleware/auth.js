const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ msg: 'Access denied. No authentication token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Access denied. Unauthorized operational access level.' });
      }
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Authentication token is invalid or expired.' });
    }
  };
};

module.exports = auth;