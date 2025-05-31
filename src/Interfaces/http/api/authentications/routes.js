// Mendefinisikan fungsi `routes` yang menerima sebuah parameter `handler`
// `handler` ini adalah instance dari `AuthenticationsHandler` yang sudah berisi method untuk menangani request.
const routes = (handler) => [
  {
    // Route pertama: menangani login atau autentikasi pengguna
    method: "POST", // HTTP method POST digunakan karena kita mengirimkan data (username & password) untuk login
    path: "/authentications", // Endpoint URL untuk login pengguna
    handler: handler.postAuthenticationHandler, // Method handler yang akan menangani logic login
  },
  {
    // Route kedua: menangani permintaan refresh token
    method: "PUT", // HTTP method PUT digunakan karena ini operasi pembaruan accessToken berdasarkan refreshToken
    path: "/authentications", // Endpoint yang sama digunakan untuk memperbarui accessToken
    handler: handler.putAuthenticationHandler, // Method handler untuk logic refresh accessToken
  },
  {
    // Route ketiga: menangani permintaan logout pengguna
    method: "DELETE", // HTTP method DELETE digunakan karena kita menghapus/menghapus validitas refreshToken (logout)
    path: "/authentications", // Endpoint yang sama digunakan untuk logout
    handler: handler.deleteAuthenticationHandler, // Method handler yang menangani logic logout
  },
];

// Mengekspor fungsi routes agar bisa digunakan di file lain, seperti dalam plugin autentikasi
module.exports = routes;
