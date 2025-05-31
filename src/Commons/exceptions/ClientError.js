// Membuat kelas ClientError yang merupakan subclass dari built-in Error di JavaScript
// Kelas ini digunakan sebagai kelas dasar (abstract class) untuk error yang berasal dari client (status 4xx)
class ClientError extends Error {
  // Konstruktor menerima dua parameter:
  // - message: pesan error yang menjelaskan penyebab error
  // - statusCode: kode status HTTP yang default-nya 400 (Bad Request)
  constructor(message, statusCode = 400) {
    // Memanggil konstruktor kelas Error dengan message agar properti message dan stack trace otomatis di-set
    super(message);

    // Membuat mekanisme abstract class:
    // Jika kelas yang sedang dibuat objeknya adalah ClientError langsung,
    // maka error dilempar agar ClientError tidak bisa langsung diinstansiasi
    // Ini memastikan ClientError hanya bisa diwariskan, tidak bisa dipakai langsung
    if (this.constructor.name === "ClientError") {
      throw new Error("cannot instantiate abstract class");
    }

    // Menetapkan properti statusCode pada objek error ini
    // Properti ini akan menandakan status HTTP error ketika digunakan pada response API
    this.statusCode = statusCode;

    // Mengatur properti name menjadi 'ClientError'
    // Biasanya properti ini digunakan untuk membedakan jenis error ketika di-handle
    this.name = "ClientError";
  }
}

// Mengekspor kelas ClientError agar dapat digunakan di file lain dalam proyek
module.exports = ClientError;
