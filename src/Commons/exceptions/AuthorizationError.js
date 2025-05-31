// Mengimpor kelas ClientError dari file lokal './ClientError'
// ClientError adalah kelas dasar untuk error yang disebabkan oleh client (status HTTP 4xx)
const ClientError = require("./ClientError");

// Mendefinisikan kelas AuthorizationError yang merupakan subclass dari ClientError
// Kelas ini mewakili error khusus terkait masalah otorisasi (akses yang tidak diizinkan)
class AuthorizationError extends ClientError {
  // Konstruktor menerima parameter pesan error (message)
  constructor(message) {
    // Memanggil konstruktor induk ClientError dengan dua argumen:
    // 1. message: pesan error spesifik yang diberikan saat membuat objek error ini
    // 2. 403: kode status HTTP yang menandakan Forbidden (akses terlarang/ditolak)
    super(message, 403);

    // Mengatur nama error menjadi 'AuthorizationError'
    // Nama ini memudahkan identifikasi jenis error saat debugging atau penanganan error
    this.name = "AuthorizationError";
  }
}

// Mengekspor kelas AuthorizationError agar bisa digunakan di file lain dalam aplikasi
module.exports = AuthorizationError;
