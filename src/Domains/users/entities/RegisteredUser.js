class RegisteredUser {
  // Konstruktor kelas RegisteredUser menerima sebuah objek payload
  constructor(payload) {
    // Memanggil method _verifyPayload untuk memvalidasi data payload sebelum menginisialisasi properti
    this._verifyPayload(payload);

    // Destructuring payload untuk mengambil properti id, username, dan fullname
    const { id, username, fullname } = payload;

    // Menginisialisasi properti instance dengan nilai dari payload
    this.id = id; // ID unik user, diharapkan string
    this.username = username; // Nama pengguna, diharapkan string
    this.fullname = fullname; // Nama lengkap pengguna, diharapkan string
  }

  // Method privat untuk memvalidasi isi payload
  _verifyPayload({ id, username, fullname }) {
    // Validasi 1: Pastikan ketiga properti wajib ada dan tidak falsy (undefined, null, '', dll)
    if (!id || !username || !fullname) {
      // Jika ada properti yang tidak ada, lempar error spesifik
      throw new Error("REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // Validasi 2: Pastikan ketiga properti bertipe string
    // Jika ada tipe data yang tidak sesuai, lempar error spesifik
    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof fullname !== "string"
    ) {
      throw new Error("REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

// Mengekspor kelas RegisteredUser agar dapat digunakan di file lain
module.exports = RegisteredUser;
