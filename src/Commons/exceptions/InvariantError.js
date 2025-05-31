const ClientError = require("./ClientError"); // Mengimpor kelas ClientError sebagai superclass

class InvariantError extends ClientError {
  constructor(message) {
    super(message); // Memanggil constructor ClientError dengan pesan error dan default statusCode 400
    this.name = "InvariantError"; // Memberi nama error ini dengan 'InvariantError'
  }
}

module.exports = InvariantError; // Mengekspor kelas ini agar bisa digunakan di file lain
