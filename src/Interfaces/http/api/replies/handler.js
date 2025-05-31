// Mengimpor class ReplyUseCase dari lapisan aplikasi (use_case)
const ReplyUseCase = require("../../../../Applications/use_case/ReplyUseCase");

// Mendefinisikan class ReplyHandler yang bertanggung jawab menangani HTTP request terkait reply/balasan komentar
class ReplyHandler {
  constructor(container) {
    // Menyimpan dependency injection container yang berisi instance dari use case
    this._container = container;

    // Melakukan binding method ke instance class ini agar `this` di dalam method merujuk ke instance class
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  // Handler untuk menambahkan balasan (reply) ke sebuah komentar dalam thread
  async postReplyHandler(request, h) {
    // Mengambil instance ReplyUseCase dari container
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);

    // Mengambil id pengguna yang terautentikasi dari JWT token
    const { id: owner } = request.auth.credentials;

    // Mengambil ID thread dan ID komentar dari parameter URL
    const thread_id = request.params.threadId;
    const comment_id = request.params.commentId;

    // Membentuk payload yang akan dikirim ke use case
    const useCasePayload = {
      content: request.payload.content, // Isi reply yang dikirim user dari body request
      thread_id,
      comment_id,
      owner, // ID user yang membuat reply
    };

    // Menjalankan use case untuk menambahkan reply dan menyimpan hasilnya
    const addedReply = await replyUseCase.addReply(useCasePayload);

    // Mengembalikan response sukses dengan status 201 (Created) dan data reply yang berhasil ditambahkan
    return h
      .response({
        status: "success",
        data: {
          addedReply,
        },
      })
      .code(201);
  }

  // Handler untuk menghapus balasan (reply) dari komentar tertentu
  async deleteReplyHandler(request, h) {
    // Mengambil instance ReplyUseCase dari container
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);

    // Mengambil ID user dari autentikasi token
    const { id: owner } = request.auth.credentials;

    // Mengambil parameter dari URL: ID thread, komentar, dan reply
    const thread_id = request.params.threadId;
    const comment_id = request.params.commentId;
    const reply_id = request.params.id;

    // Membentuk payload untuk menghapus reply
    const useCasePayload = {
      thread_id,
      comment_id,
      reply_id,
      owner, // Untuk memastikan bahwa hanya pemilik reply yang bisa menghapus
    };

    // Menjalankan use case untuk menghapus reply
    await replyUseCase.deleteReply(useCasePayload);

    // Mengembalikan response sukses tanpa data tambahan
    return h.response({
      status: "success",
    });
  }
}

// Mengekspor class ReplyHandler agar bisa digunakan di plugin Hapi
module.exports = ReplyHandler;
