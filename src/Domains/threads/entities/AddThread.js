class AddThread {
  // Konstruktor kelas AddThread menerima satu parameter yaitu payload,
  // yang merupakan objek berisi data untuk membuat thread baru.
  constructor(payload) {
    // Memanggil method privat _verifyPayload untuk memvalidasi payload
    this._verifyPayload(payload);

    // Menggunakan destructuring untuk mengambil properti title, body, owner dari payload
    const { title, body, owner } = payload;

    // Setelah validasi berhasil, properti instance ditetapkan dengan nilai dari payload
    this.title = title; // judul thread, harus berupa string dengan maksimal 50 karakter
    this.body = body; // isi/body thread, harus string
    this.owner = owner; // pemilik thread (user id), harus string
  }

  // Method privat _verifyPayload untuk validasi data input
  _verifyPayload({ title, body, owner }) {
    // 1. Cek apakah semua properti yang dibutuhkan ada dan tidak falsy (null, undefined, kosong, dll)
    if (!title || !body || !owner) {
      // Jika ada properti yang hilang, lempar error dengan pesan khusus
      throw new Error("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // 2. Cek tipe data setiap properti harus string
    if (
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof owner !== "string"
    ) {
      // Jika tipe data salah, lempar error dengan pesan khusus
      throw new Error("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    // 3. Validasi panjang string title tidak boleh lebih dari 50 karakter
    if (title.length > 50) {
      // Jika melebihi batas, lempar error dengan pesan khusus
      throw new Error("ADD_THREAD.TITLE_LIMIT_CHAR");
    }
  }
}

// Mengeksport kelas AddThread agar bisa digunakan di modul lain (misalnya untuk testing atau service)
module.exports = AddThread;
