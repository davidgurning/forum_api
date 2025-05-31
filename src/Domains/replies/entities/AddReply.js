// Mendefinisikan class bernama AddReply untuk merepresentasikan entitas balasan (reply) yang akan ditambahkan.
class AddReply {
  // Konstruktor class: akan dijalankan saat instance baru dari AddReply dibuat.
  constructor(payload) {
    console.log(payload);
    // Memanggil method privat untuk memverifikasi bahwa payload valid.
    this._verifyPayload(payload);

    // Menggunakan destructuring assignment untuk mengambil properti dari payload.
    const { thread_id, comment_id, content, owner } = payload;

    // Menyimpan data ke properti instance yang bisa diakses dari luar class.
    this.thread_id = thread_id; // ID thread tempat komentar berada
    this.comment_id = comment_id; // ID komentar yang akan diberi balasan
    this.content = content; // Isi teks balasan
    this.owner = owner; // ID user yang membuat balasan
  }

  // Method privat untuk memverifikasi kelengkapan dan tipe data dari payload.
  _verifyPayload({ thread_id, comment_id, content, owner }) {
    // Validasi 1: Periksa apakah semua properti wajib tersedia (tidak undefined/null).
    if (!thread_id || !comment_id || !content || !owner) {
      // Jika salah satu properti tidak ada, lempar error dengan pesan spesifik.
      throw new Error("ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // Validasi 2: Periksa apakah semua properti memiliki tipe data string.
    if (
      typeof thread_id !== "string" || // thread_id harus string
      typeof comment_id !== "string" || // comment_id harus string
      typeof content !== "string" || // content harus string
      typeof owner !== "string" // owner harus string
    ) {
      // Jika salah satu properti memiliki tipe data salah, lempar error spesifik.
      throw new Error("ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

// Mengekspor class agar bisa digunakan di file lain menggunakan require().
module.exports = AddReply;
