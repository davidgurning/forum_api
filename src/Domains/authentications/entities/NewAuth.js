class NewAuth {
  constructor(payload) {
    // Ketika objek NewAuth dibuat, constructor ini dijalankan
    // Pertama, memanggil method _verifyPayload untuk memvalidasi payload input
    this._verifyPayload(payload);

    // Jika validasi berhasil, simpan properti accessToken dan refreshToken dari payload
    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
  }

  _verifyPayload(payload) {
    // Method privat untuk memeriksa validitas objek payload

    // Destructuring properti accessToken dan refreshToken dari payload
    const { accessToken, refreshToken } = payload;

    // Cek apakah accessToken atau refreshToken tidak ada (undefined, null, atau falsy)
    // Jika ada salah satu yang tidak ada, lempar error dengan pesan spesifik
    if (!accessToken || !refreshToken) {
      throw new Error("NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // Cek apakah tipe data accessToken dan refreshToken bukan string
    // Jika salah satu bukan string, lempar error dengan pesan spesifik
    if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
      throw new Error("NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = NewAuth;
// Ekspor class NewAuth agar bisa digunakan di file lain (misalnya di test atau module lain)
