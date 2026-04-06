const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'brother_trans_secret_key_2026';

router.post('/register', async (req, res) => {
  const { name, email, phone, password, referred_by } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID(); 
    const joinDate = new Date().toISOString();
    const referralCode = `BR-${name.substring(0,3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

    db.run(`INSERT INTO users (id, name, email, phone, password, join_date, referral_code) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      [userId, name, email, phone, hashedPassword, joinDate, referralCode], function(err) {
        if (err) return res.status(400).json({ success: false, error: 'Email sudah terdaftar.' });

        if (referred_by) {
          db.run(`UPDATE users SET miles = miles + 50 WHERE referral_code = ?`, [referred_by.toUpperCase()]);
        }
        res.json({ success: true, message: 'Registrasi berhasil.' });
    });
  } catch (error) { res.status(500).json({ success: false }); }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ success: false, error: 'Email tidak ditemukan.' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ success: false, error: 'Password salah.' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    delete user.password;
    res.json({ success: true, user, token });
  });
});

module.exports = router;