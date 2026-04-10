const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ==========================================
// 1. KONEKSI DATABASE
// ==========================================
const dbPath = path.resolve(__dirname, 'brother_trans.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Gagal terhubung ke database:', err.message);
    process.exit(1); // Gagal koneksi DB = server tidak boleh jalan
  }
  console.log('✅ Berhasil terhubung ke database SQLite.');
});

// Aktifkan Foreign Key & WAL mode untuk performa lebih baik
db.run("PRAGMA foreign_keys = ON");
db.run("PRAGMA journal_mode = WAL");

// ==========================================
// 2. HELPER: Tambah kolom jika belum ada (untuk migrasi)
// ==========================================
const addColumnIfNotExists = (tableName, columnName, columnDef) => {
  db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`, (err) => {
    if (err && !err.message.includes("duplicate column name")) {
      console.error(`⚠️  Gagal menambah ${columnName} di ${tableName}:`, err.message);
    }
  });
};

// ==========================================
// 3. SCHEMA — Definisi Tabel
// ==========================================
db.serialize(() => {
  console.log('⏳ Memeriksa dan membuat tabel database...');

  // --- USERS ---
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      permissions TEXT DEFAULT '[]',
      kyc_status TEXT DEFAULT 'unverified',
      kyc_code TEXT,
      miles INTEGER DEFAULT 0,
      location TEXT DEFAULT 'Lainnya',
      profile_picture TEXT,
      profile_banner TEXT,
      referral_code TEXT UNIQUE,
      reset_token TEXT,
      reset_token_expiry INTEGER,
      has_completed_tc_gamification INTEGER DEFAULT 0,
      join_date TEXT NOT NULL
    )
  `);

  // --- MOTORS (Katalog) ---
  db.run(`
    CREATE TABLE IF NOT EXISTS motors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT DEFAULT 'Lempuyangan',
      base_price INTEGER NOT NULL,
      price_12h INTEGER DEFAULT 0,
      stock INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      allow_dynamic_pricing INTEGER DEFAULT 1
    )
  `);

  // --- MOTOR UNITS (Plat Nomor per Motor) ---
  db.run(`
    CREATE TABLE IF NOT EXISTS motor_units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      motor_id INTEGER NOT NULL,
      plate_number TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'RDY',
      condition_notes TEXT,
      FOREIGN KEY (motor_id) REFERENCES motors(id) ON DELETE CASCADE
    )
  `);

  // --- LOCKERS ---
  db.run(`
    CREATE TABLE IF NOT EXISTS lockers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT NOT NULL,
      size TEXT NOT NULL,
      base_price INTEGER NOT NULL,
      stock INTEGER NOT NULL
    )
  `);

  // --- BOOKINGS ---
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      order_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      item_name TEXT NOT NULL,
      location TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      total_price INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'paid',
      unit_id INTEGER,
      plate_number TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // --- PRICE RULES (Surge & Seasonal) ---
  db.run(`
    CREATE TABLE IF NOT EXISTS price_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rule_type TEXT NOT NULL,
      name TEXT,
      start_date TEXT,
      end_date TEXT,
      stock_condition INTEGER,
      markup_percentage INTEGER NOT NULL,
      is_active INTEGER DEFAULT 1
    )
  `);

  // --- SUPPORT TICKETS ---
  db.run(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_number TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      order_id TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // --- PROMOTIONS ---
  db.run(`
    CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      code TEXT NOT NULL,
      image TEXT NOT NULL,
      desc TEXT,
      tag TEXT,
      is_active INTEGER DEFAULT 1,
      usage_limit INTEGER DEFAULT 0,
      current_usage INTEGER DEFAULT 0,
      discount_percent INTEGER DEFAULT 0,
      max_discount INTEGER DEFAULT 0
    )
  `);

  // --- ARTICLES ---
  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      category TEXT DEFAULT 'Berita',
      image_url TEXT,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'draft',
      meta_title TEXT,
      meta_desc TEXT,
      geo_location TEXT,
      scheduled_at TEXT,
      views INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // ==========================================
  // 4. MIGRASI — Tambah kolom baru untuk database lama
  //    (Aman dijalankan berulang kali, diabaikan jika sudah ada)
  // ==========================================
  addColumnIfNotExists('users', 'kyc_code', 'TEXT');
  addColumnIfNotExists('users', 'permissions', "TEXT DEFAULT '[]'");
  addColumnIfNotExists('users', 'location', 'TEXT DEFAULT "Lainnya"');
  addColumnIfNotExists('users', 'has_completed_tc_gamification', 'INTEGER DEFAULT 0');

  addColumnIfNotExists('bookings', 'payment_status', 'TEXT DEFAULT "paid"');
  addColumnIfNotExists('bookings', 'unit_id', 'INTEGER');
  addColumnIfNotExists('bookings', 'plate_number', 'TEXT');
  addColumnIfNotExists('bookings', 'created_at', "TEXT");

  addColumnIfNotExists('motors', 'location', 'TEXT DEFAULT "Lempuyangan"');
  addColumnIfNotExists('motors', 'price_12h', 'INTEGER DEFAULT 0');
  addColumnIfNotExists('motors', 'allow_dynamic_pricing', 'INTEGER DEFAULT 1');

  addColumnIfNotExists('promotions', 'usage_limit', 'INTEGER DEFAULT 0');
  addColumnIfNotExists('promotions', 'current_usage', 'INTEGER DEFAULT 0');
  addColumnIfNotExists('promotions', 'discount_percent', 'INTEGER DEFAULT 0');
  addColumnIfNotExists('promotions', 'max_discount', 'INTEGER DEFAULT 0');

  addColumnIfNotExists('articles', 'slug', 'TEXT');
  addColumnIfNotExists('articles', 'meta_title', 'TEXT');
  addColumnIfNotExists('articles', 'meta_desc', 'TEXT');
  addColumnIfNotExists('articles', 'geo_location', 'TEXT');
  addColumnIfNotExists('articles', 'views', 'INTEGER DEFAULT 0');

  // ==========================================
  // 5. INDEXES — Percepat query yang sering dipakai
  // ==========================================
  db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON users(kyc_status)`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date)`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_motor_units_motor_id ON motor_units(motor_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_motor_units_status ON motor_units(status)`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_price_rules_type ON price_rules(rule_type, is_active)`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code)`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id)`);

  console.log('✅ Semua tabel, migrasi & index berhasil diverifikasi!');
});

module.exports = db;
