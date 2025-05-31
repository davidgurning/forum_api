// Mengimpor CommentHandler yang bertugas menangani permintaan HTTP terkait komentar
const CommentHandler = require("./handler");

// Mengimpor file routes yang mendefinisikan rute-rute HTTP (endpoint) untuk komentar
const routes = require("./routes");

// Mengekspor objek plugin Hapi dengan konfigurasi untuk fitur "comments"
module.exports = {
  // Nama plugin, digunakan oleh Hapi untuk mengidentifikasi plugin ini
  name: "comments",

  // Fungsi `register` adalah metode utama yang dipanggil oleh Hapi saat plugin ini didaftarkan ke server
  // Ini adalah fungsi async karena bisa melakukan operasi asinkron (misalnya mengakses database, atau container DI)
  register: async (server, { container }) => {
    // Membuat instance dari CommentHandler dan menyuntikkan `container` (dependency injection container)
    const commentHandler = new CommentHandler(container);

    // Mendaftarkan semua route yang didefinisikan di file `routes.js`, dan mengikatnya dengan handler yang telah dibuat
    server.route(routes(commentHandler));
  },
};
