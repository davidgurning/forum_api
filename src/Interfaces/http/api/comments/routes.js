// Mendefinisikan fungsi `routes` yang menerima sebuah parameter `handler`
// Parameter `handler` berisi method-method dari class CommentHandler yang akan menangani request di endpoint terkait
const routes = (handler) => [
  {
    // Rute pertama menggunakan method HTTP POST
    method: "POST",

    // Endpoint: menambahkan komentar pada sebuah thread
    // `{threadId}` adalah parameter dinamis yang akan diambil dari URL, mewakili ID thread tempat komentar ditambahkan
    path: "/threads/{threadId}/comments",

    // Handler: method yang akan menangani logic dari request ini
    // Di sini diarahkan ke `postCommentHandler` milik CommentHandler
    handler: handler.postCommentHandler,

    // Opsi tambahan untuk route ini
    options: {
      // Mengharuskan user untuk terautentikasi sebelum bisa mengakses endpoint ini
      // 'forum_api_jwt' adalah nama strategi autentikasi JWT yang sudah didefinisikan sebelumnya di server
      auth: "forum_api_jwt",
    },
  },
  {
    // Rute kedua menggunakan method HTTP DELETE
    method: "DELETE",

    // Endpoint: menghapus komentar dari thread tertentu
    // `{threadId}` adalah ID thread dan `{id}` adalah ID dari komentar yang akan dihapus
    path: "/threads/{threadId}/comments/{id}",

    // Handler: method yang akan menangani permintaan delete komentar
    handler: handler.deleteCommentHandler,

    // Opsi tambahan untuk route ini
    options: {
      // Mengharuskan autentikasi JWT agar hanya user yang memiliki hak bisa menghapus komentar
      auth: "forum_api_jwt",
    },
  },
];

// Mengekspor fungsi routes agar dapat digunakan di file plugin (index.js)
module.exports = routes;
