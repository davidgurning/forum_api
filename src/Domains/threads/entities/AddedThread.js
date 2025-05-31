class AddedThread {
  // Konstruktor kelas AddedThread menerima satu parameter yaitu payload,
  // yang merupakan objek yang berisi data untuk membuat instance AddedThread.
  constructor(payload) {
    // Memanggil method privat _verifyPayload untuk memvalidasi payload
    this._verifyPayload(payload);

    // Jika payload valid, maka properti instance ditetapkan dari payload
    this.id = payload.id; // id thread, harus berupa string unik
    this.title = payload.title; // judul thread, string
    this.owner = payload.owner; // pemilik thread, string (biasanya user id)
  }

  // Method privat _verifyPayload menerima objek payload dan memeriksa
  // apakah payload memenuhi persyaratan:
  _verifyPayload({ id, title, owner }) {
    // 1. Mengecek apakah semua properti yang diperlukan ada dan tidak falsy (null, undefined, kosong, dll)
    if (!id || !title || !owner) {
      // Jika salah satu properti tidak ada, lempar error dengan pesan khusus
      throw new Error("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // 2. Mengecek tipe data masing-masing properti harus string
    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof owner !== "string"
    ) {
      // Jika ada tipe data yang tidak sesuai, lempar error dengan pesan khusus
      throw new Error("ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

// Mengeksport kelas AddedThread agar bisa digunakan pada modul lain
module.exports = AddedThread;
