// Fungsi routes yang menerima parameter 'handler', yaitu objek handler yang berisi fungsi-fungsi handler untuk route
const routes = (handler) => [
  {
    // HTTP method yang digunakan untuk route ini adalah POST,
    // biasanya POST digunakan untuk membuat data baru di server
    method: "POST",

    // URL path endpoint yang akan di-handle,
    // di sini endpointnya adalah '/users' yang biasanya digunakan untuk operasi terkait user, seperti registrasi
    path: "/users",

    // Handler function yang akan dipanggil saat endpoint ini diakses dengan method POST,
    // handler ini adalah method 'postUserHandler' milik objek handler yang diterima sebagai parameter
    handler: handler.postUserHandler,
  },
];

// Mengekspor fungsi routes agar bisa digunakan oleh modul lain,
// biasanya fungsi ini akan dipanggil dengan mengirimkan objek handler untuk menghubungkan route dengan fungsi handler yang tepat
module.exports = routes;
