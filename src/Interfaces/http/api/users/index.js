// Mengimpor kelas UsersHandler dari file 'handler' pada direktori yang sama
// UsersHandler berisi logika untuk menangani request yang berhubungan dengan user
const UsersHandler = require("./handler");

// Mengimpor routes yang didefinisikan di file 'routes' pada direktori yang sama
// Routes berisi definisi endpoint HTTP dan handler yang meng-handle tiap route
const routes = require("./routes");

// Mengekspor sebuah object yang merepresentasikan plugin/module Hapi.js
module.exports = {
  // Nama plugin ini, biasanya digunakan untuk identifikasi dalam server Hapi
  name: "users",

  // Fungsi register yang dieksekusi saat plugin ini didaftarkan ke server Hapi
  // Fungsi ini bersifat asynchronous dan menerima dua parameter:
  // - server: instance server Hapi tempat plugin didaftarkan
  // - options: object berisi konfigurasi tambahan, di sini kita hanya mengambil container dari options
  register: async (server, { container }) => {
    // Membuat instance UsersHandler dengan menyuntikkan container sebagai dependency
    // Container ini berfungsi untuk mengambil instance-use case dan service yang dibutuhkan oleh handler
    const usersHandler = new UsersHandler(container);

    // Menggunakan server.route untuk mendaftarkan route-route yang sudah didefinisikan
    // Routes ini dihasilkan dari pemanggilan fungsi routes dengan memasukkan instance usersHandler sebagai handler-nya
    // Dengan begitu, setiap endpoint route akan menggunakan method-method dari usersHandler sebagai handler request
    server.route(routes(usersHandler));
  },
};
