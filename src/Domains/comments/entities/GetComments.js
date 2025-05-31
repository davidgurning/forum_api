// Kelas GetComments ini merepresentasikan kumpulan komentar yang diambil dari suatu sumber data,
// biasanya dari database atau API, dan bertugas melakukan validasi serta pemetaan data komentar tersebut.
class GetComments {
  // Konstruktor menerima payload yang berisi properti 'comments', yaitu array objek komentar
  constructor(payload) {
    // Memanggil fungsi untuk verifikasi validitas payload (struktur dan tipe data)
    this._verifyPayload(payload);

    // Melakukan pemetaan data komentar untuk memproses konten komentar khusus (misal komentar yang sudah dihapus)
    const comments = this._mapComments(payload);

    // Menyimpan hasil pemetaan ke properti kelas 'comments'
    this.comments = comments;
  }

  // Fungsi privat untuk memvalidasi payload yang diterima
  _verifyPayload({ comments }) {
    // Pertama, cek apakah 'comments' adalah sebuah array
    if (!Array.isArray(comments)) {
      // Jika bukan array, lempar error tipe data
      throw new Error("GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    // Looping setiap elemen dalam array comments untuk cek kelengkapan properti yang dibutuhkan
    for (const comment of comments) {
      // Cek apakah setiap comment memiliki properti id, username, date, content, dan deletedAt
      const id = "id" in comment;
      const username = "username" in comment;
      const date = "date" in comment;
      const content = "content" in comment;
      const deletedAt = "deletedAt" in comment;

      // Jika salah satu properti tidak ada, lempar error properti kurang
      if (!id || !username || !date || !content || !deletedAt) {
        throw new Error("GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY");
      }
    }

    // Looping kembali untuk cek tipe data setiap properti pada setiap comment
    for (const comment of comments) {
      for (const key in comment) {
        // Jika properti adalah 'deletedAt', tipe yang diizinkan adalah string atau null (bisa berarti belum dihapus)
        if (key === "deletedAt") {
          if (typeof comment[key] !== "string" && comment[key] !== null) {
            throw new Error("GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION");
          }
        } else {
          // Untuk properti lain, tipe harus string
          if (typeof comment[key] !== "string") {
            throw new Error("GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION");
          }
        }
      }
    }
  }

  // Fungsi privat untuk memetakan ulang data komentar
  _mapComments({ comments }) {
    // Mapping setiap comment ke objek baru dengan struktur yang sama,
    // namun jika komentar sudah dihapus (deletedAt ada dan tidak null),
    // maka kontennya akan diganti dengan teks khusus '**komentar telah dihapus**'
    return comments.map((comment) => ({
      id: comment.id, // ID komentar
      username: comment.username, // Nama pengguna pembuat komentar
      date: comment.date, // Tanggal komentar dibuat
      content: comment.deletedAt // Jika deletedAt ada (komentar dihapus), tampilkan teks khusus
        ? "**komentar telah dihapus**"
        : comment.content, // Jika tidak, tampilkan isi komentar asli
    }));
  }
}

// Mengekspor kelas GetComments agar dapat digunakan pada modul lain (misalnya use case, controller)
module.exports = GetComments;
