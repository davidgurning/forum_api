/* istanbul ignore file */
// Memberitahu Istanbul untuk mengabaikan file ini saat menghitung cakupan kode,
// karena ini adalah helper khusus untuk testing dan bukan bagian dari logika utama aplikasi.

const pool = require("../src/Infrastructures/database/postgres/pool");
// Mengimpor koneksi pool PostgreSQL yang sudah dikonfigurasi dari modul database.
// Pool ini digunakan untuk menjalankan query ke database dalam helper ini.

// Membuat objek RepliesTableTestHelper yang berisi fungsi-fungsi untuk manipulasi data tabel "replies"
// Utility ini berguna untuk setup, verifikasi, dan cleanup data dalam pengujian unit/integrasi.
const RepliesTableTestHelper = {
  // Fungsi async untuk menambahkan data reply baru ke dalam tabel "replies".
  // Menggunakan parameter destructuring dengan nilai default agar mudah dipakai saat testing.
  async addReply({
    id = "reply-123", // ID reply, default adalah dummy ID untuk testing
    thread_id = "thread-123", // ID thread tempat reply berada
    comment_id = "comment-123", // ID comment tempat reply berada (reply terkait comment tertentu)
    content = "Dummy content of reply", // Isi konten reply
    owner = "user-123", // ID user yang membuat reply
  }) {
    // Mendapatkan waktu saat ini dalam format ISO string untuk kolom created_at
    const date = new Date().toISOString();

    // Kolom deleted_at diisi dengan null karena reply baru belum dihapus (soft delete)
    const deletedAt = null;

    // Menyiapkan query insert menggunakan parameterized query untuk menghindari SQL Injection
    const query = {
      // Query insert dengan 7 kolom yang sesuai dengan struktur tabel replies
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)",
      values: [id, content, owner, thread_id, comment_id, date, deletedAt], // nilai parameter query
    };

    // Menjalankan query insert ke database
    await pool.query(query);
  },

  // Fungsi async untuk mencari reply berdasarkan ID-nya
  async findRepliesById(id) {
    // Query select untuk mencari seluruh kolom reply dengan ID tertentu
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [id],
    };

    // Menjalankan query dan menyimpan hasilnya
    const result = await pool.query(query);

    // Mengembalikan array rows berisi data reply yang ditemukan (bisa kosong jika tidak ada)
    return result.rows;
  },

  // Fungsi async untuk mengambil nilai kolom deleted_at pada reply tertentu berdasarkan ID
  async checkDeletedAtRepliesById(id) {
    // Query select hanya kolom deleted_at dari reply dengan ID tertentu
    const query = {
      text: "SELECT deleted_at FROM replies WHERE id = $1",
      values: [id],
    };

    // Eksekusi query
    const result = await pool.query(query);

    // Ambil nilai deleted_at dari baris pertama hasil query
    const deletedAt = result.rows[0].deleted_at;

    // Mengembalikan nilai deleted_at yang bisa berupa null (jika belum dihapus) atau timestamp
    return deletedAt;
  },

  // Fungsi async untuk melakukan soft delete reply berdasarkan ID dengan mengisi kolom deleted_at
  async deleteRepliesById(id) {
    // Mengambil waktu sekarang sebagai waktu penghapusan soft delete
    const deletedAt = new Date().toISOString();

    // Query update untuk mengisi kolom deleted_at pada baris reply tertentu
    const query = {
      text: "UPDATE replies SET deleted_at = $2 WHERE id = $1",
      values: [id, deletedAt],
    };

    // Menjalankan query update
    await pool.query(query);
  },

  // Fungsi async untuk menghapus semua data dalam tabel replies
  // Biasanya dipakai untuk reset state database setelah testing agar data bersih
  async cleanTable() {
    // Query delete tanpa filter (WHERE 1=1 selalu true) menghapus seluruh isi tabel replies
    await pool.query("DELETE FROM replies WHERE 1=1");
  },
};

// Mengeksport helper ini agar dapat digunakan oleh file test lain dalam project
module.exports = RepliesTableTestHelper;
