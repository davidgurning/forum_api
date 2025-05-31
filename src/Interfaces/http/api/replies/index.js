// Mengimpor ReplyHandler, yaitu class yang berisi method untuk menangani request HTTP terkait reply/balasan komentar
const ReplyHandler = require("./handler");

// Mengimpor fungsi routes, yang akan mengembalikan array konfigurasi rute berdasarkan handler yang diberikan
const routes = require("./routes");

// Mengekspor sebuah object sebagai plugin untuk Hapi.js
module.exports = {
  // Menentukan nama plugin ini, yaitu 'replies'
  name: "replies",

  // Fungsi register adalah lifecycle method yang dipanggil oleh Hapi ketika plugin didaftarkan
  register: async (server, { container }) => {
    // Membuat instance dari ReplyHandler dan menyuntikkan (inject) container sebagai dependensi
    const replyHandler = new ReplyHandler(container);

    /**
     * Menambahkan rute-rute ke server Hapi.
     * Fungsi `routes(replyHandler)` akan menghasilkan array konfigurasi route
     * yang masing-masing terhubung ke method di `replyHandler`, seperti `postReplyHandler`, `deleteReplyHandler`, dll.
     */
    server.route(routes(replyHandler));
  },
};
