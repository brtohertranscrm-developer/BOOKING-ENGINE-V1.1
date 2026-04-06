const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/motors', (req, res) => {
  // Coba hapus sementara "WHERE stock > 0" untuk memastikan data benar-benar bisa ditarik
  db.all('SELECT * FROM motors ORDER BY base_price ASC', (err, rows) => {
    if (err) {
      console.error("Error fetching motors:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    // Pastikan mengembalikan array kosong jika tidak ada data, bukan undefined
    res.json({ success: true, data: rows || [] }); 
  });
});

router.get('/lockers', (req, res) => {
  db.all('SELECT * FROM lockers ORDER BY location ASC', (err, rows) => res.json({ success: true, data: rows }));
});

router.get('/promotions', (req, res) => {
  db.all('SELECT * FROM promotions', (err, rows) => res.json({ success: true, data: rows }));
});

router.get('/articles', (req, res) => {
  db.all(`SELECT * FROM articles WHERE status = 'published' ORDER BY created_at DESC`, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: rows });
  });
});

router.get('/articles/:id', (req, res) => {
  db.get('SELECT * FROM articles WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    res.json({ success: true, data: row });
  });
});

module.exports = router;