// Fungsi routes yang menerima parameter handler (instance dari ReplyHandler)
// Fungsi ini akan mengembalikan array konfigurasi route untuk fitur replies (balasan komentar)
const routes = (handler) => [
  {
    // HTTP method yang digunakan adalah POST, artinya route ini untuk membuat data baru (menambahkan reply)
    method: "POST",

    // Path endpoint untuk membuat reply pada sebuah comment tertentu dalam thread tertentu
    // {threadId} adalah parameter path untuk ID thread yang spesifik
    // {commentId} adalah parameter path untuk ID komentar yang akan dibalas
    path: "/threads/{threadId}/comments/{commentId}/replies",

    // Handler yang akan dijalankan ketika endpoint ini dipanggil
    // Menggunakan method postReplyHandler dari handler yang diberikan
    handler: handler.postReplyHandler,

    // Opsi tambahan untuk route ini
    options: {
      // Mengaktifkan autentikasi dengan strategy 'forum_api_jwt'
      // Artinya user harus login dan mengirim token JWT yang valid untuk mengakses route ini
      auth: "forum_api_jwt",
    },
  },
  {
    // HTTP method DELETE, digunakan untuk menghapus data (reply)
    method: "DELETE",

    // Path endpoint untuk menghapus reply tertentu dari sebuah comment dalam thread tertentu
    // {threadId} = ID thread, {commentId} = ID komentar, {id} = ID reply yang akan dihapus
    path: "/threads/{threadId}/comments/{commentId}/replies/{id}",

    // Handler yang akan dijalankan saat permintaan delete reply diterima
    handler: handler.deleteReplyHandler,

    // Opsi autentikasi sama seperti POST, menggunakan JWT strategy
    options: {
      auth: "forum_api_jwt",
    },
  },
];

// Mengekspor fungsi routes agar bisa digunakan di file lain seperti plugin register
module.exports = routes;
