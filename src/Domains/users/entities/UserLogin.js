class UserLogin {
  // Konstruktor kelas UserLogin yang menerima objek payload sebagai input data login user
  constructor(payload) {
    // Memanggil method _verifyPayload untuk memastikan payload valid sebelum menyimpan datanya
    this._verifyPayload(payload);

    // Jika payload valid, menetapkan properti username dan password dari payload ke instance
    this.username = payload.username; // Nama pengguna (username), harus berupa string
    this.password = payload.password; // Password pengguna, harus berupa string
  }

  // Method privat untuk melakukan validasi pada payload yang diberikan
  _verifyPayload(payload) {
    // Melakukan destructuring untuk mengambil properti username dan password dari payload
    const { username, password } = payload;

    // Validasi 1: Pastikan username dan password ada dan tidak falsy (undefined, null, '', dll)
    if (!username || !password) {
      // Jika salah satu tidak ada, lempar error dengan pesan spesifik
      throw new Error("USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // Validasi 2: Pastikan username dan password adalah tipe data string
    if (typeof username !== "string" || typeof password !== "string") {
      // Jika tipe data salah, lempar error dengan pesan yang jelas
      throw new Error("USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

// Mengekspor kelas UserLogin agar dapat digunakan di modul lain
module.exports = UserLogin;
