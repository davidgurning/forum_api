// Import kelas error khusus InvariantError yang digunakan untuk validasi atau error kondisi yang tidak valid
const InvariantError = require("../../Commons/exceptions/InvariantError");
// Import kelas abstrak AuthenticationRepository sebagai interface repository autentikasi
const AuthenticationRepository = require("../../Domains/authentications/AuthenticationRepository");

// Membuat kelas AuthenticationRepositoryPostgres yang meng-extend AuthenticationRepository
// Ini adalah implementasi repository autentikasi yang menggunakan database PostgreSQL
class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  // Constructor menerima parameter pool, yaitu koneksi pool PostgreSQL untuk menjalankan query
  constructor(pool) {
    super(); // panggil constructor kelas induk (AuthenticationRepository)
    this._pool = pool; // simpan pool sebagai properti instance untuk digunakan pada method
  }

  // Method asynchronous untuk menambahkan token autentikasi ke tabel authentications
  async addToken(token) {
    // Siapkan query SQL insert dengan parameter token
    // Menggunakan parameterized query ($1) untuk mencegah SQL injection
    const query = {
      text: "INSERT INTO authentications VALUES ($1)", // Query SQL insert 1 kolom (token)
      values: [token], // Nilai token sebagai parameter $1
    };

    // Eksekusi query ke database menggunakan pool.query
    await this._pool.query(query);
  }

  // Method asynchronous untuk mengecek ketersediaan token di tabel authentications
  // Berguna untuk memastikan token refresh yang diterima memang ada di database (valid)
  async checkAvailabilityToken(token) {
    // Siapkan query SQL select yang mencari token yang sama dengan parameter
    const query = {
      text: "SELECT * FROM authentications WHERE token = $1", // Query untuk mencari token
      values: [token], // Nilai token sebagai parameter $1
    };

    // Jalankan query ke database, simpan hasil ke variabel result
    const result = await this._pool.query(query);

    // Jika hasil query tidak ditemukan data (rows kosong), maka token tidak valid
    // Lempar InvariantError dengan pesan yang jelas bahwa token tidak ditemukan
    if (result.rows.length === 0) {
      throw new InvariantError("refresh token tidak ditemukan di database");
    }
  }

  // Method asynchronous untuk menghapus token dari tabel authentications
  async deleteToken(token) {
    // Siapkan query SQL DELETE yang menghapus record dengan token tertentu
    const query = {
      text: "DELETE FROM authentications WHERE token = $1", // Query untuk hapus berdasarkan token
      values: [token], // Parameter token
    };

    // Jalankan query DELETE untuk menghapus token dari database
    await this._pool.query(query);
  }
}

// Export kelas AuthenticationRepositoryPostgres agar bisa digunakan di file lain
module.exports = AuthenticationRepositoryPostgres;
