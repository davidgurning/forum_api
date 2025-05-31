// Fungsi routes menerima parameter 'handler' yang merupakan instance dari handler kelas (misalnya ThreadHandler)
// Fungsi ini mengembalikan array konfigurasi route untuk server Hapi.js
const routes = (handler) => [
  {
    // Route untuk HTTP method POST
    method: "POST",
    // Path endpoint untuk membuat thread baru
    path: "/threads",
    // Handler yang akan mengeksekusi logika saat request POST ke /threads diterima
    // handler.postThreadHandler merujuk ke method di handler untuk membuat thread baru
    handler: handler.postThreadHandler,
    // Opsi tambahan route
    options: {
      // Mengaktifkan autentikasi menggunakan strategi 'forum_api_jwt'
      // Ini berarti client harus mengirim token JWT yang valid untuk bisa mengakses endpoint ini
      auth: "forum_api_jwt",
    },
  },
  {
    // Route untuk HTTP method GET
    method: "GET",
    // Path endpoint untuk mendapatkan data thread berdasarkan ID tertentu
    // {id} adalah parameter path dinamis yang diambil dari URL
    path: "/threads/{id}",
    // Handler yang akan mengeksekusi logika saat request GET ke /threads/{id} diterima
    // handler.getThreadHandler adalah method yang akan mengambil detail thread dengan id yang diberikan
    handler: handler.getThreadHandler,
    // Tidak ada opsi auth di sini, jadi endpoint ini kemungkinan bersifat publik (tidak memerlukan autentikasi)
  },
];

// Mengekspor fungsi routes agar bisa digunakan oleh modul lain, misalnya saat mendaftarkan routes ke server
module.exports = routes;
