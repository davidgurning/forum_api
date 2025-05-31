// Kelas AddedComment ini berfungsi sebagai entitas domain yang merepresentasikan
// data komentar yang sudah berhasil ditambahkan ke sistem.
// Biasanya kelas ini dipakai untuk menyimpan hasil komentar yang sudah disimpan,
// berisi informasi penting seperti id komentar, isi komentar, dan pemiliknya.
class AddedComment {
  // Konstruktor kelas menerima satu argumen yaitu payload objek yang berisi data komentar yang sudah ditambahkan
  constructor(payload) {
    // Memanggil metode privat untuk melakukan validasi terhadap payload sebelum digunakan
    this._verifyPayload(payload);

    // Melakukan destrukturisasi pada payload untuk mengambil properti id, content, dan owner
    const { id, content, owner } = payload;

    // Menetapkan properti kelas sesuai dengan data payload yang sudah terverifikasi
    this.id = id; // ID unik komentar yang sudah ditambahkan (contoh: 'comment-123')
    this.content = content; // Isi dari komentar tersebut (contoh: 'Ini adalah komentar saya')
    this.owner = owner; // ID pemilik komentar atau user yang membuat komentar (contoh: 'user-123')
  }

  // Metode privat yang bertugas untuk memeriksa validitas payload
  _verifyPayload({ id, content, owner }) {
    // Memastikan ketiga properti ada dan tidak kosong (falsy)
    if (!id || !content || !owner) {
      // Jika salah satu properti tidak ada, lemparkan error dengan pesan spesifik
      throw new Error("ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // Memastikan ketiga properti memiliki tipe data string
    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof owner !== "string"
    ) {
      // Jika tipe data salah, lemparkan error dengan pesan yang sesuai
      throw new Error("ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

// Mengekspor kelas AddedComment agar bisa dipakai di modul lain (misalnya service, use case, atau controller)
module.exports = AddedComment;
