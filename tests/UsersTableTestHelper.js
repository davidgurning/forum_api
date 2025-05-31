/* istanbul ignore file */
// Instruksi kepada Istanbul (tool pengukur cakupan kode) agar mengabaikan file ini.
// Karena ini adalah helper untuk testing, bukan bagian dari kode produksi utama.

const pool = require("../src/Infrastructures/database/postgres/pool");
// Mengimpor koneksi pool PostgreSQL yang sudah dikonfigurasi sebelumnya.
// Pool ini digunakan untuk menjalankan query ke database secara efisien dan terkelola.

const UsersTableTestHelper = {
  // Fungsi async untuk menambahkan user baru ke tabel "users"
  // Menggunakan destructuring parameter dengan nilai default agar mudah dipakai dalam testing
  async addUser({
    id = "user-123", // ID user default (dummy) untuk testing
    username = "dicoding", // Username user default
    password = "secret", // Password user default
    fullname = "Dicoding Indonesia", // Nama lengkap user default
  }) {
    // Membuat query insert dengan parameterized query ($1, $2, $3, $4) untuk keamanan
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4)",
      values: [id, username, password, fullname],
    };

    // Menjalankan query insert ke database
    await pool.query(query);
  },

  // Fungsi async untuk mencari user berdasarkan ID tertentu
  async findUsersById(id) {
    // Membuat query select untuk mendapatkan seluruh kolom dari user dengan id tertentu
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };

    // Menjalankan query dan menyimpan hasilnya
    const result = await pool.query(query);

    // Mengembalikan array baris hasil query (bisa kosong jika user tidak ditemukan)
    return result.rows;
  },

  // Fungsi async untuk membersihkan semua data dalam tabel users
  // Digunakan untuk memastikan environment testing bersih setiap kali dijalankan
  async cleanTable() {
    // Query DELETE tanpa kondisi menghapus semua baris dalam tabel users
    await pool.query("DELETE FROM users WHERE 1=1");
  },
};

// Mengekspor objek helper agar dapat digunakan dalam file testing lain untuk setup dan teardown data
module.exports = UsersTableTestHelper;
