/* istanbul ignore file */
// Memberitahu istanbul (tool untuk coverage testing) agar mengabaikan file ini saat menghitung cakupan kode
// Karena file ini adalah helper khusus untuk testing, bukan bagian utama aplikasi

// Mengimpor koneksi pool ke database PostgreSQL dari modul yang telah dikonfigurasi
const pool = require("../src/Infrastructures/database/postgres/pool");

// Membuat objek helper bernama AuthenticationsTableTestHelper untuk mempermudah manipulasi tabel 'authentications' pada database selama testing
const AuthenticationsTableTestHelper = {
  // Method async untuk menambahkan sebuah token autentikasi ke tabel 'authentications'
  async addToken(token) {
    // Menyiapkan query SQL dengan parameterized query untuk menghindari SQL Injection
    const query = {
      text: "INSERT INTO authentications VALUES($1)", // Query insert satu nilai token ke tabel
      values: [token], // Mengisi placeholder $1 dengan nilai token yang diberikan
    };

    // Menjalankan query ke database menggunakan pool connection
    await pool.query(query);
  },

  // Method async untuk mencari token tertentu di tabel 'authentications'
  async findToken(token) {
    // Menyiapkan query SELECT untuk mencari token yang cocok dengan parameter token
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1", // Query mencari token tertentu
      values: [token], // Mengisi $1 dengan token yang dicari
    };

    // Mengeksekusi query ke database, hasilnya disimpan dalam variabel result
    const result = await pool.query(query);

    // Mengembalikan array baris hasil pencarian token (bisa kosong jika tidak ditemukan)
    return result.rows;
  },

  // Method async untuk membersihkan (menghapus semua data) tabel 'authentications'
  async cleanTable() {
    // Query DELETE yang menghapus seluruh baris dari tabel 'authentications'
    // Kondisi 'WHERE 1=1' selalu true sehingga menghapus semua baris
    await pool.query("DELETE FROM authentications WHERE 1=1");
  },
};

// Mengeksport objek AuthenticationsTableTestHelper agar dapat digunakan oleh modul lain (biasanya file test)
module.exports = AuthenticationsTableTestHelper;
