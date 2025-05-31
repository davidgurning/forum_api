class GetThread {
  // Konstruktor kelas GetThread menerima sebuah objek payload sebagai parameter,
  // yang berisi data lengkap tentang sebuah thread yang sudah ada (misal dari database).
  constructor(payload) {
    // Panggil method privat _verifyPayload untuk memvalidasi isi payload sebelum assign properti
    this._verifyPayload(payload);

    // Setelah payload valid, assign nilai ke properti instance
    this.id = payload.id; // ID unik thread, harus string
    this.title = payload.title; // Judul thread, harus string
    this.body = payload.body; // Isi/body thread, harus string
    // Ubah tanggal string menjadi objek Date lalu format ke ISO string standar (UTC)
    this.date = new Date(payload.date).toISOString();
    this.username = payload.username; // Username pembuat thread, harus string
  }

  // Method privat untuk validasi payload input
  _verifyPayload(payload) {
    // Mengambil properti dari payload untuk validasi
    const { id, title, body, date, username } = payload;

    // 1. Cek apakah semua properti yang diperlukan ada dan bukan nilai falsy (null, undefined, '', 0, false)
    if (!id || !title || !body || !date || !username) {
      // Jika ada properti yang hilang, lempar error dengan pesan khusus
      throw new Error("GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // 2. Validasi tipe data properti harus string
    //    Ini penting karena data harus konsisten untuk diproses dan ditampilkan dengan benar
    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof date !== "string" || // tanggal dalam format string, misalnya ISO string
      typeof username !== "string"
    ) {
      // Jika tipe data tidak sesuai, lempar error dengan pesan khusus
      throw new Error("GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

// Ekspor kelas GetThread agar bisa digunakan pada modul lain, misalnya service atau unit test
module.exports = GetThread;
