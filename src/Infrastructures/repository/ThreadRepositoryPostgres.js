// Import error NotFoundError untuk menangani kasus data thread yang tidak ditemukan
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
// Import interface abstrak ThreadRepository sebagai kontrak yang harus diimplementasikan
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
// Import entitas AddedThread yang merepresentasikan thread yang sudah berhasil ditambahkan
const AddedThread = require("../../Domains/threads/entities/AddedThread");

// Implementasi kelas ThreadRepository menggunakan PostgreSQL
class ThreadRepositoryPostgres extends ThreadRepository {
  // Konstruktor menerima pool (koneksi database) dan idGenerator (fungsi pembuat id unik)
  constructor(pool, idGenerator) {
    super(); // Panggil constructor induk
    this._pool = pool; // Simpan pool untuk digunakan query ke database
    this._idGenerator = idGenerator; // Simpan fungsi generator id unik
  }

  // Method async untuk menambah thread baru ke database
  async addThread(newThread) {
    // Destructuring objek newThread untuk mendapatkan title, body, owner
    const { title, body, owner } = newThread;
    // Membuat id unik untuk thread dengan format 'thread-<idGenerator()>'
    const id = `thread-${this._idGenerator()}`;
    // Timestamp waktu saat thread dibuat, dalam format ISO string
    const created_at = new Date().toISOString();

    // Query insert data ke tabel threads, gunakan prepared statement untuk keamanan
    const query = {
      // Menyisipkan nilai id, title, body, owner, created_at ke tabel threads
      text: "INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, title, body, owner, created_at],
    };

    // Jalankan query ke database menggunakan pool koneksi
    const result = await this._pool.query(query);

    // Kembalikan objek AddedThread yang berisi data thread baru hasil insert
    return new AddedThread(result.rows[0]);
  }

  // Method async untuk mengecek apakah thread dengan threadId tersedia di database
  async checkAvailabilityThread(threadId) {
    // Query mencari thread berdasarkan id yang diberikan
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId], // Parameter id thread
    };

    // Jalankan query ke database
    const result = await this._pool.query(query);

    // Jika tidak ditemukan baris data (thread tidak ada)
    if (result.rows.length === 0) {
      // Lempar error NotFoundError dengan pesan thread tidak ditemukan
      throw new NotFoundError("thread tidak ditemukan!");
    }
  }

  // Method async untuk mengambil data thread lengkap berdasarkan id thread
  async getThread(id) {
    // Query mengambil kolom-kolom thread serta username pemilik dari tabel users
    const query = {
      text: `
              SELECT threads.id, title, body, date, username 
              FROM threads
              JOIN users ON users.id = threads.owner
              WHERE threads.id = $1
            `,
      values: [id], // Parameter id thread
    };

    // Eksekusi query dan ambil hasilnya
    const result = await this._pool.query(query);

    // Kembalikan baris pertama dari hasil query (karena id thread unik)
    return result.rows[0];
  }
}

// Export kelas agar bisa digunakan modul lain di aplikasi
module.exports = ThreadRepositoryPostgres;
