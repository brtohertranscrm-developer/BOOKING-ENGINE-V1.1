const express = require('express');
const db = require('../db');
const { verifyUser } = require('../middlewares/authMiddleware');
const router = express.Router();

// Semua route di sini otomatis menggunakan verifyUser
router.use(verifyUser);

router.get('/dashboard/me', (req, res) => {
  db.get(`SELECT id, name, email, phone, kyc_status, miles, profile_picture, profile_banner, referral_code, role FROM users WHERE id = ?`, [req.user.id], (err, user) => {
      db.get(`SELECT order_id as id, item_name as item, location, start_date as startDate, end_date as endDate, status FROM bookings WHERE user_id = ? AND status IN ('pending', 'active') ORDER BY start_date DESC LIMIT 1`, [req.user.id], (err, order) => {
          res.json({ success: true, data: { user, activeOrder: order || null } });
      });
  });
});

router.post('/support/tickets', (req, res) => {
  const { order_id, subject, message } = req.body;
  const ticketNumber = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
  db.run(`INSERT INTO support_tickets (ticket_number, user_id, order_id, subject, message) VALUES (?, ?, ?, ?, ?)`,
    [ticketNumber, req.user.id, order_id || null, subject, message], (err) => {
        if(err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, ticket_number: ticketNumber });
  });
});

router.post('/bookings', (req, res) => {
  const { order_id, item_type, item_name, location, start_date, end_date, total_price } = req.body;
  db.run(`INSERT INTO bookings (order_id, user_id, item_type, item_name, location, start_date, end_date, total_price, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 'paid')`,
    [order_id, req.user.id, item_type, item_name, location, start_date, end_date, total_price], (err) => res.json({ success: true }));
});

router.get('/users/history', (req, res) => {
  db.all(`SELECT * FROM bookings WHERE user_id = ? ORDER BY start_date DESC`, [req.user.id], (err, rows) => res.json({ success: true, data: rows }));
});

router.put('/users/kyc', (req, res) => {
  db.run(`UPDATE users SET kyc_status = ? WHERE id = ?`, [req.body.status, req.user.id], () => res.json({ success: true }));
});

router.post('/users/kyc/verify', (req, res) => {
  const { code } = req.body;
  db.get(`SELECT kyc_code FROM users WHERE id = ?`, [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row || !row.kyc_code) return res.status(400).json({ success: false, error: 'Admin belum membuatkan kode untuk Anda.' });

    if (row.kyc_code === code.trim().toUpperCase()) {
      db.run(`UPDATE users SET kyc_status = 'verified', kyc_code = NULL WHERE id = ?`, [req.user.id], function(err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: 'Akun berhasil diverifikasi.' });
      });
    } else {
      res.status(400).json({ success: false, error: 'Kode verifikasi tidak valid / salah.' });
    }
  });
});

module.exports = router;