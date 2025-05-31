const ClientError = require("./ClientError");
// Mengimpor kelas ClientError yang merupakan superclass error untuk kesalahan yang berasal dari client (status code 4xx).

class NotFoundError extends ClientError {
  constructor(message) {
    // Memanggil constructor ClientError dengan pesan error dan status code 404,
    // menandakan bahwa sumber daya yang dicari tidak ditemukan (Not Found).
    super(message, 404);

    // Memberi nama error ini sebagai 'NotFoundError' agar lebih mudah dikenali saat debugging.
    this.name = "NotFoundError";
  }
}

module.exports = NotFoundError;
// Mengekspor kelas NotFoundError agar bisa digunakan di file lain dalam proyek.
