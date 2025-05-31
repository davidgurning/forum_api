// Mendefinisikan class GetReplies yang bertugas untuk memvalidasi dan memformat data replies sebelum dikembalikan.
class GetReplies {
  // Constructor dipanggil saat instance baru dari GetReplies dibuat.
  constructor(payload) {
    // Memverifikasi struktur dan tipe data dari payload.
    this._verifyPayload(payload);

    // Melakukan transformasi (pemrosesan) data balasan untuk disesuaikan dengan format tampilan.
    const replies = this._transformReplies(payload);

    // Menyimpan hasil transformasi sebagai properti instance.
    this.replies = replies;
  }

  // Method private untuk memverifikasi isi dari payload.
  _verifyPayload({ replies }) {
    // Validasi: `replies` harus berupa array.
    if (!Array.isArray(replies)) {
      throw new Error("GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    // Iterasi setiap item dalam array replies untuk mengecek properti yang dibutuhkan.
    for (const reply of replies) {
      // Mengecek apakah setiap reply memiliki properti id, username, date, content, dan deleted_at.
      const id = "id" in reply;
      const username = "username" in reply;
      const date = "date" in reply;
      const content = "content" in reply;
      const deleted_at = "deleted_at" in reply;

      // Jika salah satu properti tidak ada, maka throw error.
      if (!id || !username || !date || !content || !deleted_at) {
        throw new Error("GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY");
      }
    }

    // Validasi tipe data untuk setiap properti reply.
    for (const reply of replies) {
      // Iterasi semua key di dalam object reply
      for (const key in reply) {
        // Khusus properti deleted_at boleh berupa null atau string.
        if (key === "deleted_at") {
          if (typeof reply[key] !== "string" && reply[key] !== null) {
            throw new Error("GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION");
          }
        }
        // Semua properti lainnya harus berupa string.
        else if (typeof reply[key] !== "string") {
          throw new Error("GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }
      }
    }
  }

  // Method private untuk mentransformasi format reply sebelum dikembalikan ke client.
  _transformReplies({ replies }) {
    return replies.map((reply) => ({
      id: reply.id, // Tetap menggunakan id asli
      username: reply.username, // Tetap menggunakan username asli
      date: reply.date, // Tetap menggunakan tanggal asli
      content: reply.deleted_at
        ? "**balasan telah dihapus**" // Jika reply telah dihapus, ganti kontennya
        : reply.content, // Jika tidak, gunakan konten asli
    }));
  }
}

// Mengekspor class agar bisa digunakan di file lain menggunakan require()
module.exports = GetReplies;
