const db = require('./db');

console.log('⏳ Memulai pengisian data awal (Seeding)...');

db.serialize(() => {
  // 1. Masukkan Data Motor
  const stmtMotor = db.prepare('INSERT INTO motors (name, category, base_price, stock, image_url) VALUES (?, ?, ?, ?, ?)');
  
  const motors = [
    ['Yamaha NMAX 155', 'Premium Matic', 100000, 5, 'https://images.unsplash.com/photo-1599819811279-d518ac6a4b16?q=80&w=600&auto=format&fit=crop'],
    ['Honda Vario 125', 'Standard Matic', 75000, 8, 'https://images.unsplash.com/photo-1625231334168-2506b98e04e9?q=80&w=600&auto=format&fit=crop'],
    ['Vespa Sprint 150', 'Lifestyle Matic', 150000, 2, 'https://images.unsplash.com/photo-1594046646545-2f5a519fc575?q=80&w=600&auto=format&fit=crop']
  ];

  motors.forEach(m => stmtMotor.run(m));
  stmtMotor.finalize();

  // 2. Masukkan Data Loker
  const stmtLocker = db.prepare('INSERT INTO lockers (location, size, base_price, stock) VALUES (?, ?, ?, ?)');
  
  const lockers = [
    ['Garasi Pusat Malioboro', 'Medium', 25000, 10],
    ['Garasi Pusat Malioboro', 'Large', 40000, 5],
    ['Garasi Stasiun Balapan', 'Medium', 25000, 8]
  ];

  lockers.forEach(l => stmtLocker.run(l));
  stmtLocker.finalize();

  // Tambahkan di dalam seed.js
const stmtUser = db.prepare('INSERT INTO users (id, name, email, password, phone, role, join_date, kyc_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

stmtUser.run(['U-001', 'Pandu Admin', 'admin@brothertrans.com', 'admin123', '08123456789', 'admin', '01/01/2026', 'approved']);
stmtUser.run(['U-002', 'Pelanggan Setia', 'user@gmail.com', 'user123', '08556677889', 'user', '02/01/2026', 'pending']);

stmtUser.finalize();

  console.log('✅ Data Motor dan Loker berhasil ditambahkan ke Database!');
});