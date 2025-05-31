// Import error khusus untuk otorisasi ketika user tidak punya hak akses
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
// Import error khusus untuk kondisi data tidak ditemukan
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
// Import interface abstrak CommentRepository sebagai contract untuk repository komentar
const CommentRepository = require("../../Domains/comments/CommentRepository");
// Import entitas AddedComment yang merepresentasikan hasil penambahan komentar
const AddedComment = require("../../Domains/comments/entities/AddedComment");

// Kelas CommentRepositoryPostgres implementasi CommentRepository dengan PostgreSQL sebagai databasenya
class CommentRepositoryPostgres extends CommentRepository {
  // Konstruktor menerima pool (koneksi ke DB) dan idGenerator (fungsi pembuat id unik)
  constructor(pool, idGenerator) {
    super(); // panggil constructor kelas induk
    this._pool = pool; // simpan koneksi pool ke properti instance
    this._idGenerator = idGenerator; // simpan fungsi pembuat id ke properti instance
  }

  // Method asynchronous untuk menambahkan komentar baru ke database
  async addComment(newComment) {
    // Destructuring properti dari objek newComment yang diterima
    const { content, thread_id, owner } = newComment;
    // Membuat id komentar unik dengan format 'comment-<idGenerator>'
    const id = `comment-${this._idGenerator()}`;
    // Mendapatkan waktu saat ini dalam format ISO string sebagai waktu komentar dibuat
    const date = new Date().toISOString();
    // Properti deletedAt diset null menandakan komentar belum dihapus
    const deletedAt = null;

    // Menyiapkan query SQL untuk memasukkan data komentar ke tabel comments
    const query = {
      // Query insert 6 kolom (id, content, owner, thread_id, date, deleted_at)
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5 ,$6) RETURNING id, content, owner",
      // Array nilai yang akan menggantikan parameter $1-$6
      values: [id, content, owner, thread_id, date, deletedAt],
    };

    // Menjalankan query ke database menggunakan pool
    const result = await this._pool.query(query);

    // Mengembalikan instance AddedComment yang diisi dengan data hasil insert
    return new AddedComment(result.rows[0]);
  }

  // Method asynchronous untuk memeriksa apakah komentar dengan id tertentu tersedia di database
  async checkAvailabilityComment(commentId) {
    // Query SQL untuk mencari komentar berdasarkan id
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId], // Parameter id komentar
    };

    // Eksekusi query dan simpan hasil
    const result = await this._pool.query(query);

    // Jika jumlah baris hasil 0, artinya komentar tidak ditemukan
    if (result.rowCount === 0) {
      // Lempar error NotFoundError dengan pesan khusus
      throw new NotFoundError("komentar tidak ditemukan!");
    }
  }

  // Method asynchronous untuk verifikasi apakah pemilik komentar sesuai dengan user yang meminta akses
  async verifyCommentOwner(commentId, owner) {
    // Query untuk mencari komentar dengan id dan owner sesuai parameter
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND owner = $2",
      values: [commentId, owner], // Parameter id dan owner
    };

    // Jalankan query dan simpan hasil
    const result = await this._pool.query(query);

    // Jika tidak ada baris yang cocok, artinya user bukan pemilik komentar
    if (result.rowCount === 0) {
      // Lempar error AuthorizationError dengan pesan gagal hapus komentar karena bukan pemilik
      throw new AuthorizationError(
        "Gagal menghapus komentar, anda bukan pemilik komentar ini!"
      );
    }
  }

  // Method asynchronous untuk menghapus komentar secara logis dengan menandai deleted_at
  async deleteComment(commentId) {
    // Mendapatkan waktu saat ini sebagai waktu penghapusan komentar
    const deletedAt = new Date().toISOString();
    // Query update kolom deleted_at pada komentar dengan id tertentu
    const query = {
      text: "UPDATE comments SET deleted_at = $2 WHERE id = $1",
      values: [commentId, deletedAt], // Parameter id dan waktu deletedAt
    };

    // Jalankan query update ke database
    await this._pool.query(query);
  }

  // Method asynchronous untuk mengambil semua komentar pada sebuah thread berdasarkan threadId
  async getComments(threadId) {
    // Query SQL kompleks untuk mengambil data komentar dan join data username dari tabel users
    const query = {
      text: `SELECT comments.id, comments.thread_id, users.username, comments.date AS date, comments.content, comments.deleted_at
            FROM comments 
            LEFT JOIN threads ON threads.id = comments.thread_id 
            LEFT JOIN users ON users.id = comments.owner
            WHERE comments.thread_id = $1 
            ORDER BY comments.date 
            ASC`,
      values: [threadId], // Parameter thread id
    };

    // Jalankan query dan destructure rows (data komentar)
    const { rows } = await this._pool.query(query);

    // Kembalikan array komentar yang sudah berisi username pemilik komentar
    return rows;
  }
}

// Export kelas agar bisa digunakan di file lain
module.exports = CommentRepositoryPostgres;
