class RegisterUser {
  // Konstruktor kelas RegisterUser menerima objek payload sebagai input data user baru
  constructor(payload) {
    // Memanggil method _verifyPayload untuk memvalidasi isi payload sebelum menetapkan properti
    this._verifyPayload(payload);

    // Mengambil properti username, password, fullname dari objek payload secara destructuring
    const { username, password, fullname } = payload;

    // Menginisialisasi properti instance dengan data dari payload
    this.username = username; // Nama pengguna, tipe string, harus valid dan sesuai aturan
    this.password = password; // Password user, tipe string
    this.fullname = fullname; // Nama lengkap user, tipe string
  }

  // Method privat untuk validasi payload yang diberikan pada constructor
  _verifyPayload({ username, password, fullname }) {
    // Validasi 1: Memastikan ketiga properti tidak kosong/null/undefined/falsy
    if (!username || !password || !fullname) {
      // Jika ada properti yang hilang, lempar error dengan pesan yang jelas
      throw new Error("REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // Validasi 2: Memastikan tipe data semua properti harus string
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof fullname !== "string"
    ) {
      // Jika tipe data salah, lempar error dengan pesan spesifik
      throw new Error("REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    // Validasi 3: Panjang username tidak boleh melebihi 50 karakter
    if (username.length > 50) {
      // Jika username terlalu panjang, lempar error dengan pesan khusus
      throw new Error("REGISTER_USER.USERNAME_LIMIT_CHAR");
    }

    // Validasi 4: Username hanya boleh mengandung karakter alfanumerik dan underscore
    // Regex ^[\w]+$ artinya hanya huruf, angka, dan underscore, tanpa spasi atau karakter khusus lain
    if (!username.match(/^[\w]+$/)) {
      // Jika ada karakter terlarang, lempar error dengan pesan yang jelas
      throw new Error("REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER");
    }
  }
}

// Mengekspor kelas RegisterUser agar dapat digunakan di modul/file lain
module.exports = RegisterUser;
