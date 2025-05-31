/* istanbul ignore file */
// Menginstruksikan Istanbul untuk mengabaikan file ini dalam perhitungan cakupan kode,
// karena ini adalah file helper untuk testing saja, bukan bagian dari logika aplikasi utama.

const pool = require("../src/Infrastructures/database/postgres/pool");
// Mengimpor koneksi pool PostgreSQL yang sudah dikonfigurasi.
// Pool ini digunakan untuk menjalankan query ke database secara efisien.

const ThreadsTableTestHelper = {
  // Fungsi async untuk menambahkan data thread baru ke dalam tabel "threads"
  // Menggunakan destructuring object dengan nilai default agar mudah dipakai dalam testing
  async addThread({
    id = "thread-123", // ID thread (default dummy untuk testing)
    title = "title thread", // Judul thread
    body = "body thread", // Isi konten body thread
    owner = "user-123", // ID user yang membuat thread
  }) {
    // Mendapatkan timestamp saat ini dalam format ISO string untuk kolom created_at
    const date = new Date().toISOString();

    // Membuat query insert ke tabel threads dengan 5 kolom: id, title, body, owner, created_at
    // Parameterized query menggunakan $1, $2,... untuk keamanan dari SQL Injection
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5)",
      values: [id, title, body, owner, date],
    };

    // Menjalankan query insert ke database
    await pool.query(query);
  },

  // Fungsi async untuk mencari thread berdasarkan ID tertentu
  async findThreadsById(id) {
    // Membuat query select untuk mendapatkan semua kolom dari threads yang sesuai ID
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    // Menjalankan query ke database dan menyimpan hasilnya
    const result = await pool.query(query);

    // Mengembalikan baris hasil query sebagai array (bisa kosong jika tidak ditemukan)
    return result.rows;
  },

  // Fungsi async untuk menghapus semua data di tabel threads
  // Umumnya digunakan untuk membersihkan tabel setelah testing agar data tidak bercampur
  async cleanTable() {
    // Query DELETE tanpa kondisi (WHERE 1=1 selalu true) menghapus semua data pada tabel
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

// Mengekspor objek helper ini agar bisa dipakai di file testing lain untuk setup dan teardown data
module.exports = ThreadsTableTestHelper;
