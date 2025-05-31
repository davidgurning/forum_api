// Kelas AddComment ini berfungsi sebagai entitas domain untuk menampung data komentar yang akan ditambahkan.
// Kelas ini menerima payload data komentar, memvalidasi isinya, dan menyimpan properti yang dibutuhkan.
class AddComment {
  // Konstruktor kelas, menerima satu argumen yaitu payload (objek) yang berisi data komentar
  constructor(payload) {
    // Memanggil fungsi privat untuk memvalidasi payload sebelum menetapkan properti kelas
    this._verifyPayload(payload);

    // Melakukan destructuring untuk mengambil properti owner, thread_id, dan content dari payload
    const { owner, thread_id, content } = payload;

    // Menetapkan nilai properti kelas sesuai dengan data yang valid dari payload
    this.owner = owner; // ID atau identifier pemilik komentar (user yang membuat komentar)
    this.thread_id = thread_id; // ID thread (diskusi) tempat komentar tersebut dibuat
    this.content = content; // Isi dari komentar yang ditambahkan (berbentuk string)
  }

  // Metode privat yang bertugas memverifikasi kelengkapan dan tipe data payload
  _verifyPayload({ owner, thread_id, content }) {
    // Pertama, cek apakah semua properti yang diperlukan ada dan tidak falsy (undefined, null, '')
    if (!owner || !thread_id || !content) {
      // Jika ada salah satu properti yang hilang, lempar error dengan pesan khusus
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // Kedua, cek apakah tipe data ketiga properti sudah sesuai, yaitu harus berupa string
    if (
      typeof owner !== "string" ||
      typeof thread_id !== "string" ||
      typeof content !== "string"
    ) {
      // Jika ada tipe data yang tidak sesuai, lempar error dengan pesan khusus yang berbeda
      throw new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

// Mengeksport kelas AddComment agar dapat digunakan di file lain (misalnya untuk pembuatan objek AddComment di logic aplikasi)
module.exports = AddComment;
