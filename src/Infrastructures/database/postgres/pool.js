/* istanbul ignore file */
// Baris ini memberitahu Istanbul (tool coverage testing) untuk mengabaikan file ini saat menghitung coverage
// Biasanya dilakukan karena ini file konfigurasi koneksi database yang tidak perlu diuji langsung

const { Pool } = require("pg");
// Mengimpor kelas Pool dari modul 'pg' (PostgreSQL client untuk Node.js)
// Pool berfungsi untuk mengelola kumpulan koneksi ke database Postgres agar lebih efisien

// Konfigurasi koneksi khusus untuk environment testing, diambil dari environment variables
const testConfig = {
  host: process.env.PGHOST_TEST, // Host database testing
  port: process.env.PGPORT_TEST, // Port database testing
  user: process.env.PGUSER_TEST, // Username untuk akses database testing
  password: process.env.PGPASSWORD_TEST, // Password untuk akses database testing
  database: process.env.PGDATABASE_TEST, // Nama database testing
};

// Membuat instance Pool berdasarkan kondisi environment
// Jika environment adalah 'test', maka gunakan konfigurasi khusus testConfig
// Jika bukan test, maka gunakan konfigurasi default (diambil dari environment variabel standar)
// Ini memungkinkan saat testing menggunakan database terpisah supaya tidak mengganggu data produksi/development
const pool =
  process.env.NODE_ENV === "test" ? new Pool(testConfig) : new Pool();

// Mengekspor pool agar bisa digunakan oleh modul lain untuk query ke database PostgreSQL
module.exports = pool;
