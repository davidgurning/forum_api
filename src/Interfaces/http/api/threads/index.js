// Mengimpor kelas ThreadHandler dari file handler.js yang berisi logika pengelolaan thread
const ThreadHandler = require("./handler");

// Mengimpor definisi routes dari file routes.js yang berisi daftar route HTTP untuk fitur threads
const routes = require("./routes");

// Mengekspor sebuah objek plugin Hapi.js yang merepresentasikan modul 'threads'
module.exports = {
  // Nama plugin ini, digunakan untuk registrasi di server Hapi.js dan identifikasi modul
  name: "threads",

  // Fungsi register yang akan dipanggil oleh Hapi.js saat plugin ini didaftarkan ke server
  // Parameter 'server' adalah instance server Hapi.js yang sedang berjalan
  // Parameter kedua adalah objek opsi yang mengandung 'container' yaitu dependency injection container
  register: async (server, { container }) => {
    // Membuat instance ThreadHandler dan meng-inject container ke dalamnya
    // Instance ini akan menangani permintaan HTTP terkait thread
    const threadHandler = new ThreadHandler(container);

    // Mengambil daftar route dari fungsi routes dengan memasukkan threadHandler sebagai handler-nya
    // Daftar route ini kemudian didaftarkan ke server sehingga server bisa merespon HTTP request terkait threads
    server.route(routes(threadHandler));
  },
};
