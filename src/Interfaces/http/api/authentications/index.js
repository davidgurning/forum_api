// Mengimpor file routes yang berisi konfigurasi rute (endpoint HTTP) untuk autentikasi
const routes = require("./routes");

// Mengimpor handler yang berisi class `AuthenticationsHandler` untuk menangani logic dari setiap rute
const AuthenticationsHandler = require("./handler");

// Mengekspor modul sebagai plugin Hapi.js
module.exports = {
  // Menentukan nama plugin. Nama ini digunakan oleh Hapi saat mendaftarkan plugin ini ke server.
  name: "authentications",

  // Fungsi register adalah fungsi utama dalam plugin Hapi. Fungsi ini akan dipanggil ketika plugin di-"register" ke server Hapi.
  // Fungsi ini bersifat async karena dapat melakukan operasi asynchronous saat pendaftaran.
  register: async (server, { container }) => {
    /**
     * Membuat instance dari AuthenticationsHandler dengan menyuntikkan dependency `container`.
     * `container` adalah objek Dependency Injection yang berisi semua instance use case yang dibutuhkan handler.
     */
    const authenticationsHandler = new AuthenticationsHandler(container);

    /**
     * Mendaftarkan semua rute autentikasi ke server Hapi.
     * Fungsi `routes(authenticationsHandler)` akan mengembalikan array konfigurasi rute
     * dan masing-masing rute akan menggunakan method dari `authenticationsHandler` sebagai handlernya.
     */
    server.route(routes(authenticationsHandler));
  },
};
