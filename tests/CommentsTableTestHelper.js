/* istanbul ignore file */
// Memberitahu Istanbul (tool untuk coverage testing) agar mengabaikan file ini saat menghitung cakupan kode
// Karena ini adalah helper khusus untuk testing, bukan bagian utama aplikasi

// Mengimpor koneksi pool PostgreSQL dari modul yang sudah dikonfigurasi sebelumnya
const pool = require("../src/Infrastructures/database/postgres/pool");

// Membuat objek CommentsTableTestHelper sebagai utility/helper untuk manipulasi tabel 'comments' selama testing
const CommentsTableTestHelper = {
  // Method async untuk menambahkan komentar baru ke tabel 'comments'
  // Menggunakan parameter destructuring dengan default values untuk fleksibilitas pemanggilan
  async addComment({
    id = "comment-123", // ID komentar (default dummy)
    thread_id = "thread-123", // ID thread tempat komentar berada
    content = "Dummy content of comment", // Isi komentar
    owner = "user-123", // ID pengguna yang membuat komentar
  }) {
    // Membuat timestamp current time dalam format ISO string untuk kolom created_at
    const date = new Date().toISOString();

    // Kolom deleted_at diisi null karena komentar baru belum dihapus
    const deletedAt = null;

    // Menyiapkan query SQL dengan parameterized query untuk menghindari SQL Injection
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)", // Query insert dengan 6 kolom sesuai urutan
      values: [id, content, owner, thread_id, date, deletedAt], // Nilai-nilai yang diinsert sesuai kolom tabel
    };

    // Eksekusi query insert ke database
    await pool.query(query);
  },

  // Method async untuk mencari komentar berdasarkan ID-nya
  async findCommentsById(id) {
    // Query SELECT mencari seluruh kolom di tabel comments dengan kondisi id tertentu
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    // Menjalankan query dan menyimpan hasilnya
    const result = await pool.query(query);

    // Mengembalikan array rows yang berisi hasil pencarian (bisa kosong jika tidak ditemukan)
    return result.rows;
  },

  // Method async untuk mengecek nilai deleted_at pada komentar tertentu berdasarkan id
  async checkdeletedAtCommentsById(id) {
    // Query SELECT hanya kolom deleted_at pada komentar yang dimaksud
    const query = {
      text: "SELECT deleted_at FROM comments WHERE id = $1",
      values: [id],
    };

    // Eksekusi query
    const result = await pool.query(query);

    // Ambil nilai deleted_at dari baris pertama hasil query (diasumsikan hanya satu baris sesuai ID unik)
    const deletedAt = result.rows[0].deleted_at;

    // Mengembalikan nilai deleted_at (bisa null jika komentar belum dihapus)
    return deletedAt;
  },

  // Method async untuk melakukan "soft delete" pada komentar dengan mengisi kolom deleted_at dengan waktu saat ini
  async deleteCommentsById(id) {
    // Membuat timestamp current time dalam format ISO string sebagai waktu penghapusan
    const deletedAt = new Date().toISOString();

    // Query UPDATE mengisi kolom deleted_at dengan waktu penghapusan berdasarkan id komentar
    const query = {
      // Catatan: Ada typo di sini, koma setelah $2 harus dihapus agar query valid
      text: "UPDATE comments SET deleted_at = $2 WHERE id = $1", // Update deleted_at pada komentar yang sesuai id
      values: [id, deletedAt], // Parameter id dan deletedAt untuk query
    };

    // Menjalankan query update di database
    await pool.query(query);
  },

  // Method async untuk menghapus semua data dalam tabel comments, biasanya dipakai untuk reset state testing
  async cleanTable() {
    // Query DELETE yang menghapus semua baris pada tabel comments
    // Kondisi 'WHERE 1=1' selalu true sehingga menghapus seluruh isi tabel
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

// Mengeksport helper ini agar dapat digunakan oleh file-file test lain dalam project
module.exports = CommentsTableTestHelper;
