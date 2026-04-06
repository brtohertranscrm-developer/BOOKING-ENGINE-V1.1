const express = require('express');
const db = require('../db');
const { verifyAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Semua route di sini otomatis menggunakan verifyAdmin
router.use(verifyAdmin);

router.get('/stats', (req, res) => {
  const stats = { revenue: 0, activeMotors: 0, activeLockers: 0, pendingKyc: 0 };
  let done = 0;
  const check = () => { done++; if (done === 4) res.json({ success: true, data: stats }); };

  db.get(`SELECT SUM(total_price) as total FROM bookings WHERE status != 'cancelled'`, (err, row) => { stats.revenue = row?.total || 0; check(); });
  db.get(`SELECT COUNT(*) as count FROM bookings WHERE item_type = 'motor' AND status = 'active'`, (err, row) => { stats.activeMotors = row?.count || 0; check(); });
  db.get(`SELECT COUNT(*) as count FROM lockers WHERE status = 'occupied'`, (err, row) => { stats.activeLockers = row?.count || 0; check(); });
  db.get(`SELECT COUNT(*) as count FROM users WHERE kyc_status = 'pending'`, (err, row) => { stats.pendingKyc = row?.count || 0; check(); });
});

// KYC Management
router.get('/kyc', (req, res) => {
  db.all(`SELECT id, name, email, phone, kyc_status, kyc_code, miles FROM users ORDER BY join_date DESC`, (err, rows) => res.json({ success: true, data: rows }));
});

router.post('/kyc/:id/code', (req, res) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let newCode = 'BT-';
  for (let i = 0; i < 6; i++) newCode += chars.charAt(Math.floor(Math.random() * chars.length));

  db.run(`UPDATE users SET kyc_code = ? WHERE id = ?`, [newCode, req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, code: newCode });
  });
});

router.put('/kyc/:id', (req, res) => {
  const { status } = req.body;
  const query = status === 'rejected' ? `UPDATE users SET kyc_status = ?, kyc_code = NULL WHERE id = ?` : `UPDATE users SET kyc_status = ? WHERE id = ?`;
  db.run(query, [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, message: `Status KYC berhasil diubah menjadi ${status}` });
  });
});

// Motors, Lockers, Bookings, Promotions, Support, Articles (Sama seperti sebelumnya)
// Untuk mempersingkat pesan ini, silakan copy semua route app.get/post/put/delete admin yang tersisa dari file lama Anda ke sini, 
// ganti 'app.' menjadi 'router.' dan hapus 'verifyAdmin' karena sudah diset di atas.
router.get('/motors', (req, res) => { db.all('SELECT * FROM motors ORDER BY id DESC', (err, rows) => res.json({ success: true, data: rows })); });
// ... (tambahkan route admin lainnya di sini)

module.exports = router;