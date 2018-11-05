const jwt = require('../../node_modules/jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authentication.split(' ')[1];
    const decoded = jwt.verify(token, 'secret', null);
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Auth failed' });
  }
};