// Mengimpor kelas ClientError dari file lokal './ClientError'
// ClientError merupakan kelas error dasar untuk kesalahan yang terjadi di sisi client (HTTP status 4xx)
const ClientError = require("./ClientError");

// Mendefinisikan kelas AuthenticationError yang merupakan subclass dari ClientError
// AuthenticationError mewakili jenis error khusus untuk masalah autentikasi (misal: gagal login, token invalid, dsb)
class AuthenticationError extends ClientError {
  // Konstruktor kelas AuthenticationError menerima satu parameter yaitu pesan error (message)
  constructor(message) {
    // Memanggil konstruktor induk (ClientError) dengan dua argumen:
    // 1. message: pesan error yang diberikan saat membuat objek error ini
    // 2. 401: kode status HTTP yang menunjukkan Unauthorized (tidak terautentikasi)
    super(message, 401);

    // Mengatur properti name pada objek error ini menjadi 'AuthenticationError'
    // Properti name berguna untuk mengidentifikasi jenis error ini saat debugging atau logging
    this.name = "AuthenticationError";
  }
}

// Mengekspor kelas AuthenticationError agar dapat digunakan di file lain
module.exports = AuthenticationError;
