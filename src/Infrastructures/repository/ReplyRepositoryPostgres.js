// Import error khusus untuk otorisasi, digunakan jika user tidak punya hak akses terhadap resource tertentu
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
// Import error khusus untuk kondisi data tidak ditemukan di database
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
// Import interface abstrak ReplyRepository sebagai kontrak untuk implementasi repository reply
const ReplyRepository = require("../../Domains/replies/ReplyRepository");
// Import entitas AddedReply yang mewakili objek reply yang baru saja berhasil ditambahkan
const AddedReply = require("../../Domains/replies/entities/AddedReply");

// Implementasi kelas ReplyRepository menggunakan PostgreSQL sebagai database
class ReplyRepositoryPostgres extends ReplyRepository {
  // Konstruktor menerima dua parameter: pool (koneksi database) dan idGenerator (fungsi pembuat id unik)
  constructor(pool, idGenerator) {
    super(); // Panggil constructor kelas induk ReplyRepository
    this._pool = pool; // Simpan instance pool database ke properti kelas
    this._idGenerator = idGenerator; // Simpan fungsi generator id ke properti kelas
  }

  // Method asynchronous untuk menambahkan reply baru ke tabel replies
  async addReply(replyData) {
    console.log("LOGG");

    // Destructuring data reply yang diperlukan dari objek replyData
    const { thread_id, comment_id, content, owner } = replyData;
    // Membuat id unik untuk reply dengan format 'reply-<idGenerator()>'
    const id = `reply-${this._idGenerator()}`;
    // Mendapatkan timestamp saat ini dalam format ISO string untuk tanggal reply dibuat
    const date = new Date().toISOString();
    // Properti deletedAt diset null karena reply baru belum dihapus
    const deletedAt = null;

    // Menyusun query SQL insert dengan parameter untuk menghindari SQL Injection
    const query = {
      // Query insert ke tabel replies, mengisi kolom id, content, owner, thread_id, comment_id, date, deleted_at
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner",
      // Array nilai yang menggantikan placeholder $1 sampai $7
      values: [id, content, owner, thread_id, comment_id, date, deletedAt],
    };

    // Eksekusi query ke database menggunakan pool koneksi
    const result = await this._pool.query(query);

    // Mengembalikan objek AddedReply baru berdasarkan data yang dikembalikan dari query insert
    return new AddedReply(result.rows[0]);
  }

  // Method asynchronous untuk memeriksa ketersediaan reply dengan id tertentu di database
  async checkAvailabilityReply(replyId) {
    // Menyusun query SQL untuk mengambil reply berdasarkan id
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [replyId], // Parameter id reply
    };

    // Eksekusi query dan simpan hasilnya
    const result = await this._pool.query(query);

    // Jika tidak ada baris yang ditemukan, artinya reply tidak tersedia
    if (result.rowCount === 0) {
      // Lempar error NotFoundError dengan pesan bahwa reply tidak ditemukan
      throw new NotFoundError("balasan tidak ditemukan!");
    }
  }

  // Method asynchronous untuk memverifikasi apakah pemilik reply sesuai dengan user yang meminta akses
  async verifyReplyOwner(replyId, owner) {
    // Query untuk mencari reply berdasarkan id dan pemiliknya (owner)
    const query = {
      text: "SELECT * FROM replies WHERE id = $1 AND owner = $2",
      values: [replyId, owner], // Parameter id reply dan owner
    };

    // Eksekusi query dan simpan hasilnya
    const result = await this._pool.query(query);

    // Jika tidak ada baris hasil, berarti user bukan pemilik reply tersebut
    if (result.rowCount === 0) {
      // Lempar error AuthorizationError dengan pesan khusus bahwa user tidak berhak menghapus reply
      throw new AuthorizationError(
        "Gagal menghapus pesan reply, anda bukan pemilik reply ini!."
      );
    }
  }

  // Method asynchronous untuk menghapus reply secara logis dengan mengisi kolom deleted_at
  async deleteReply(replyId) {
    // Ambil waktu sekarang sebagai waktu penghapusan reply
    const deletedAt = new Date().toISOString();
    // Query update kolom deleted_at pada reply yang sesuai id
    const query = {
      text: "UPDATE replies SET deleted_at = $2 WHERE id = $1",
      values: [replyId, deletedAt], // Parameter id reply dan waktu deleted_at
    };

    // Jalankan query update
    await this._pool.query(query);
  }

  // Method asynchronous untuk mengambil seluruh reply pada thread tertentu berdasarkan threadId
  async getReplies(threadId) {
    // Query SQL dengan join ke tabel comments dan users untuk mendapatkan username pemilik reply
    const query = {
      text: `SELECT replies.id, replies.comment_id, replies.thread_id, users.username, replies.date, replies.content, replies.deleted_at 
            FROM replies 
            LEFT JOIN comments ON comments.id = replies.comment_id
            LEFT JOIN users ON users.id = replies.owner 
            WHERE replies.thread_id = $1 
            ORDER BY replies.date
            ASC`,
      values: [threadId], // Parameter thread id untuk filter reply
    };

    // Eksekusi query dan destructure rows hasilnya sebagai array reply
    const { rows } = await this._pool.query(query);

    // Kembalikan array reply lengkap dengan data username pemilik dan status deleted_at
    return rows;
  }
}

// Export kelas agar bisa digunakan di modul lain
module.exports = ReplyRepositoryPostgres;
