const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

// ==========================================
// 1. MIDDLEWARE UMUM
// ==========================================

// CORS — hanya izinkan origin yang terdaftar
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (Postman, curl, mobile app)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`Origin ${origin} tidak diizinkan oleh CORS.`));
  },
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files — folder uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// ==========================================
// 2. ROUTES
// ==========================================
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);

// ==========================================
// 3. HEALTH CHECK (berguna untuk monitoring)
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// 4. 404 HANDLER — route tidak ditemukan
// ==========================================
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.` });
});

// ==========================================
// 5. GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.message);
  console.error(err.stack);

  // CORS error
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ success: false, error: err.message });
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: 'Ukuran file terlalu besar. Maksimal 5MB.' });
  }

  // Default
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Terjadi kesalahan pada server.'
      : err.message
  });
});

// ==========================================
// 6. START SERVER + GRACEFUL SHUTDOWN
// ==========================================
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend API Brother Trans berjalan di: http://localhost:${PORT}`);
});

// Graceful shutdown — tutup koneksi DB dengan benar saat server mati
const shutdown = (signal) => {
  console.log(`\n⚠️  ${signal} diterima. Menutup server...`);
  server.close(() => {
    db.close((err) => {
      if (err) console.error('❌ Gagal menutup database:', err.message);
      else console.log('✅ Koneksi database ditutup.');
      process.exit(0);
    });
  });

  // Paksa tutup setelah 10 detik jika masih ada koneksi menggantung
  setTimeout(() => {
    console.error('⚠️  Timeout — paksa shutdown.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
