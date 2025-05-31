// Mengimpor kelas CommentUseCase yang berisi logika bisnis untuk menambahkan dan menghapus komentar
const CommentUseCase = require("../../../../Applications/use_case/CommentUseCase");

// Mendefinisikan kelas CommentHandler yang akan menangani permintaan HTTP terkait komentar
class CommentHandler {
  // Konstruktor menerima parameter `container`, yaitu instance dari dependency injection container
  constructor(container) {
    this._container = container; // Menyimpan container agar bisa digunakan untuk mengambil instance use case

    // Melakukan binding context `this` agar tetap merujuk ke instance CommentHandler saat digunakan sebagai callback
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  // Handler untuk menambahkan komentar ke dalam sebuah thread
  async postCommentHandler(request, h) {
    // Mengambil instance CommentUseCase dari container
    const commentUseCase = this._container.getInstance(CommentUseCase.name);

    // Mengambil id dari pengguna yang terautentikasi (biasanya di-set oleh plugin autentikasi Hapi)
    const { id: owner } = request.auth.credentials;

    // Mengambil threadId dari parameter URL
    const thread_id = request.params.threadId;

    // Menyusun data yang akan dikirim ke use case untuk menambahkan komentar
    const useCasePayload = {
      content: request.payload.content, // Isi komentar dari payload request
      thread_id, // ID dari thread tempat komentar ditambahkan
      owner, // ID dari pemilik komentar (pengguna yang login)
    };

    // Menjalankan use case untuk menambahkan komentar
    const addedComment = await commentUseCase.addComment(useCasePayload);

    // Mengembalikan response sukses dengan status 201 (Created), dan menyertakan data komentar yang berhasil ditambahkan
    return h
      .response({
        status: "success",
        data: {
          addedComment,
        },
      })
      .code(201);
  }

  // Handler untuk menghapus komentar dari sebuah thread
  async deleteCommentHandler(request, h) {
    // Mengambil instance CommentUseCase dari container
    const commentUseCase = this._container.getInstance(CommentUseCase.name);

    // Mengambil ID pengguna yang sedang login dari objek autentikasi
    const { id: owner } = request.auth.credentials;

    // Mengambil thread ID dari parameter URL
    const thread_id = request.params.threadId;

    // Mengambil comment ID dari parameter URL
    const comment_id = request.params.id;

    // Menyusun data yang akan dikirim ke use case untuk menghapus komentar
    const useCasePayload = {
      thread_id, // ID thread tempat komentar berada
      comment_id, // ID komentar yang akan dihapus
      owner, // ID pemilik komentar (pengguna yang melakukan request)
    };

    // Menjalankan use case untuk menghapus komentar
    await commentUseCase.deleteComment(useCasePayload);

    // Mengembalikan response sukses (default status 200) tanpa data tambahan
    return h.response({
      status: "success",
    });
  }
}

// Mengekspor kelas CommentHandler agar bisa digunakan di plugin Hapi lainnya atau dalam konfigurasi route
module.exports = CommentHandler;
