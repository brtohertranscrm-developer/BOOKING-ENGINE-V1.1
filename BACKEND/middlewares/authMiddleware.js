const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'brother_trans_secret_key_2026';

const verifyUser = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ success: false, error: 'Akses ditolak.' });
  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token tidak valid.' });
  }
};

const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ success: false, error: 'Akses ditolak.' });
  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(401).json({ success: false, error: 'Bukan Admin.' });
    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token tidak valid.' });
  }
};

module.exports = { verifyUser, verifyAdmin };