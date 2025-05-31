// Memuat file .env agar variabel lingkungan (environment variables) yang didefinisikan di .env bisa digunakan dalam aplikasi
require("dotenv").config();

// Mengimpor fungsi createServer dari modul createServer, yang bertanggung jawab membuat dan mengkonfigurasi instance server HTTP (misalnya Hapi.js)
const createServer = require("./Infrastructures/http/createServer");

// Mengimpor container dependency injection yang berisi instance dan konfigurasi service yang digunakan di aplikasi
const container = require("./Infrastructures/container");

// Membuat fungsi async yang langsung dieksekusi (IIFE - Immediately Invoked Function Expression)
// Digunakan supaya bisa menggunakan 'await' di level atas untuk mempermudah penanganan asynchronous
(async () => {
  // Memanggil createServer dengan mengirimkan container, lalu menunggu server selesai dibuat
  // Server ini sudah terkonfigurasi dengan routes, plugins, dan middleware yang dibutuhkan
  const server = await createServer(container);

  // Memulai server, server mulai menerima request HTTP
  await server.start();

  // Setelah server berhasil berjalan, mencetak informasi ke console yang menunjukkan URL dimana server berjalan
  console.log(`server start at ${server.info.uri}`);
})();
