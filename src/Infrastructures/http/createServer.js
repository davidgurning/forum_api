// Import library Hapi framework untuk membuat server HTTP
const Hapi = require("@hapi/hapi");

// Import class khusus untuk error yang berasal dari client (misal: input salah)
const ClientError = require("../../Commons/exceptions/ClientError");

// Import modul untuk menerjemahkan error dari domain bisnis ke error yang bisa dipahami server
const DomainErrorTranslator = require("../../Commons/exceptions/DomainErrorTranslator");

// Import modul API handler untuk berbagai fitur di aplikasi forum
const users = require("../../Interfaces/http/api/users");
const authentications = require("../../Interfaces/http/api/authentications");
const threads = require("../../Interfaces/http/api/threads");
const comments = require("../../Interfaces/http/api/comments");
const replies = require("../../Interfaces/http/api/replies");

// Import plugin JWT dari @hapi/jwt untuk otentikasi berbasis token JWT
const Jwt = require("@hapi/jwt");

// Fungsi utama untuk membuat dan mengkonfigurasi server Hapi dengan dependency injection container
const createServer = async (container) => {
  // Membuat instance server Hapi dengan konfigurasi host dan port dari environment variables
  const server = Hapi.server({
    host: process.env.HOST, // alamat server, contoh: 'localhost'
    port: process.env.PORT, // port server, contoh: 5000
  });

  // Mendaftarkan plugin JWT ke server agar bisa digunakan untuk autentikasi JWT
  await server.register([
    {
      plugin: Jwt, // plugin JWT untuk otentikasi token
    },
  ]);

  // Mendefinisikan strategi autentikasi bernama "forum_api_jwt" menggunakan metode JWT
  server.auth.strategy("forum_api_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY, // kunci rahasia untuk verifikasi JWT (harus sama dengan yang digunakan saat membuat token)
    verify: {
      aud: false, // tidak memverifikasi audience
      iss: false, // tidak memverifikasi issuer
      sub: false, // tidak memverifikasi subject
      maxAgeSec: process.env.ACCESS_TOKEN_AGE, // masa berlaku token dalam detik
    },
    // Fungsi validasi setelah token terverifikasi berhasil
    validate: (artifacts) => ({
      isValid: true, // menyatakan token valid
      credentials: {
        id: artifacts.decoded.payload.id, // mengambil user id dari payload token untuk disimpan di credentials
      },
    }),
  });

  // Mendaftarkan plugin-plugin routing API (users, authentications, threads, comments, replies)
  // Setiap plugin mendapat akses ke container yang berisi dependency injection (misal: service, repo)
  await server.register([
    {
      plugin: users,
      options: { container }, // meneruskan container untuk dependency injection
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: replies,
      options: { container },
    },
  ]);

  // Menambahkan extension point onPreResponse untuk intercept response sebelum dikirim ke client
  server.ext("onPreResponse", (request, h) => {
    // Mendapatkan objek response dari request (bisa response biasa atau error)
    const { response } = request;

    // Cek apakah response tersebut adalah instance Error (menandakan ada error)
    if (response instanceof Error) {
      // Terjemahkan error ke error yang sudah dikenal oleh sistem menggunakan DomainErrorTranslator
      const translatedError = DomainErrorTranslator.translate(response);

      // Jika error tersebut merupakan ClientError (misal validasi gagal), tangani secara khusus
      if (translatedError instanceof ClientError) {
        // Membuat response baru dengan format JSON yang menyatakan gagal (fail) dan pesan error
        const newResponse = h.response({
          status: "fail", // status fail menandakan error dari client
          message: translatedError.message, // pesan error yang sudah diterjemahkan
        });
        newResponse.code(translatedError.statusCode); // set HTTP status code sesuai error (contoh 400)
        return newResponse; // kirim response error ke client
      }

      // Jika error bukan ClientError tapi juga bukan error server, biarkan Hapi tangani secara default
      if (!translatedError.isServer) {
        return h.continue; // lanjutkan response error native Hapi (misal 404 not found)
      }

      // Jika error merupakan error server (server failure), tangani dengan response error server umum
      const newResponse = h.response({
        status: "error", // status error menandakan kegagalan server
        message: "terjadi kegagalan pada server kami", // pesan error generik agar tidak bocor detail server
      });
      newResponse.code(500); // set status code 500 Internal Server Error
      return newResponse; // kirim response error ke client
    }

    // Jika response bukan error, lanjutkan proses response seperti biasa tanpa intervensi
    return h.continue;
  });

  // Mengembalikan instance server yang sudah dikonfigurasi lengkap
  return server;
};

// Mengekspor fungsi createServer agar bisa dipakai di file lain, misal untuk menjalankan server
module.exports = createServer;
