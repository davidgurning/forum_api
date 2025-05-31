// Import error InvariantError untuk kasus pelanggaran aturan bisnis (misal username sudah ada)
// Import entitas RegisteredUser untuk merepresentasikan user yang sudah berhasil didaftarkan
// Import interface abstrak UserRepository sebagai kontrak yang harus diimplementasikan
const InvariantError = require("../../Commons/exceptions/InvariantError");
const RegisteredUser = require("../../Domains/users/entities/RegisteredUser");
const UserRepository = require("../../Domains/users/UserRepository");

// Implementasi UserRepository menggunakan PostgreSQL sebagai database
class UserRepositoryPostgres extends UserRepository {
  // Konstruktor menerima pool (koneksi database) dan idGenerator (fungsi pembuat id unik)
  constructor(pool, idGenerator) {
    super(); // Panggil constructor parent class
    this._pool = pool; // Simpan pool database untuk digunakan query
    this._idGenerator = idGenerator; // Simpan fungsi untuk generate ID unik
  }

  // Method async untuk mengecek ketersediaan username (apakah sudah dipakai atau belum)
  async verifyAvailableUsername(username) {
    // Query mencari username di tabel users
    const query = {
      text: "SELECT username FROM users WHERE username = $1", // Query dengan prepared statement
      values: [username], // Parameter input username
    };

    // Jalankan query ke database
    const result = await this._pool.query(query);

    // Jika username ditemukan (rowCount > 0), berarti username sudah dipakai
    if (result.rowCount) {
      // Lempar error InvariantError dengan pesan username tidak tersedia
      throw new InvariantError("username tidak tersedia");
    }
  }

  // Method async untuk menambahkan user baru ke database
  async addUser(registerUser) {
    // Destructuring data user yang akan didaftarkan
    const { username, password, fullname } = registerUser;
    // Buat id unik dengan prefix 'user-' + hasil idGenerator
    const id = `user-${this._idGenerator()}`;

    // Query insert data user ke tabel users
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname",
      values: [id, username, password, fullname], // Parameter input untuk query
    };

    // Eksekusi query insert ke database
    const result = await this._pool.query(query);

    // Kembalikan entitas RegisteredUser yang berisi data user hasil insert
    return new RegisteredUser({ ...result.rows[0] });
  }

  // Method async untuk mendapatkan password hash berdasarkan username
  async getPasswordByUsername(username) {
    // Query mengambil kolom password dari users berdasarkan username
    const query = {
      text: "SELECT password FROM users WHERE username = $1",
      values: [username],
    };

    // Jalankan query ke database
    const result = await this._pool.query(query);

    // Jika username tidak ditemukan (rowCount = 0), lempar error
    if (!result.rowCount) {
      throw new InvariantError("username tidak ditemukan");
    }

    // Kembalikan password yang didapatkan dari hasil query
    return result.rows[0].password;
  }

  // Method async untuk mendapatkan id user berdasarkan username
  async getIdByUsername(username) {
    // Query mengambil kolom id dari users berdasarkan username
    const query = {
      text: "SELECT id FROM users WHERE username = $1",
      values: [username],
    };

    // Jalankan query ke database
    const result = await this._pool.query(query);

    // Jika user tidak ditemukan (rowCount = 0), lempar error
    if (!result.rowCount) {
      throw new InvariantError("user tidak ditemukan");
    }

    // Ambil id dari hasil query (baris pertama)
    const { id } = result.rows[0];

    // Kembalikan id user
    return id;
  }
}

// Export kelas agar bisa digunakan modul lain dalam aplikasi
module.exports = UserRepositoryPostgres;
