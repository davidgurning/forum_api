const AddReply = require("../../Domains/replies/entities/AddReply");

/**
 * Kelas ReplyUseCase bertanggung jawab mengelola proses bisnis terkait balasan (reply) pada sistem komentar.
 * Use case ini menangani penambahan balasan dan penghapusan balasan,
 * dengan validasi dan pengecekan terkait keberadaan thread, komentar, serta kepemilikan balasan.
 */
class ReplyUseCase {
  /**
   * Konstruktor kelas ReplyUseCase
   * @param {object} dependencies - Objek yang berisi semua dependency yang dibutuhkan oleh use case ini
   * @param {object} dependencies.replyRepository - Repository yang menangani penyimpanan dan manipulasi data balasan (reply)
   * @param {object} dependencies.commentRepository - Repository yang menangani data komentar untuk validasi keberadaan komentar
   * @param {object} dependencies.threadRepository - Repository yang menangani data thread untuk validasi keberadaan thread
   */
  constructor({ replyRepository, commentRepository, threadRepository }) {
    // Menyimpan instance repository ke properti privat untuk digunakan dalam metode kelas ini
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  /**
   * Metode untuk menambahkan balasan (reply) baru pada sebuah komentar dalam thread tertentu.
   * @param {object} useCasePayload - Data payload yang diperlukan untuk menambahkan balasan,
   * biasanya berisi thread_id, comment_id, isi balasan, dan informasi pemilik.
   * @returns {Promise<object>} Mengembalikan balasan yang sudah berhasil ditambahkan (biasanya objek balasan yang berisi id, isi, owner, dll).
   * @throws Error jika thread atau komentar yang dituju tidak ditemukan (validasi availability)
   */
  async addReply(useCasePayload) {
    // Ekstrak thread_id dan comment_id dari payload untuk validasi ketersediaan data
    const { thread_id, comment_id } = useCasePayload;
    // Validasi apakah thread dengan id tertentu ada di sistem
    await this._threadRepository.checkAvailabilityThread(thread_id);

    // Validasi apakah komentar dengan id tertentu ada di dalam thread tersebut
    await this._commentRepository.checkAvailabilityComment(comment_id);

    // Membuat instance entitas AddReply yang merepresentasikan data balasan baru
    const newReply = new AddReply(useCasePayload);
    console.log(newReply);

    // Memanggil repository untuk menyimpan balasan baru ke database dan mengembalikan hasilnya
    return this._replyRepository.addReply(newReply);
  }

  /**
   * Metode untuk menghapus balasan (reply) tertentu.
   * Melakukan beberapa validasi, seperti keberadaan thread, komentar, balasan,
   * dan memverifikasi apakah user yang melakukan penghapusan adalah pemilik balasan tersebut.
   * @param {object} useCasePayload - Payload yang berisi thread_id, comment_id, reply_id, dan owner (pemilik balasan)
   * @throws Error jika payload tidak valid, data tidak ditemukan, atau user bukan pemilik balasan.
   */
  async deleteReply(useCasePayload) {
    // Validasi terlebih dahulu struktur dan tipe data payload yang diterima
    this._validatePayload(useCasePayload);

    // Ekstrak semua data penting dari payload
    const { thread_id, comment_id, reply_id, owner } = useCasePayload;

    // Cek keberadaan thread terkait
    await this._threadRepository.checkAvailabilityThread(thread_id);

    // Cek keberadaan komentar terkait di dalam thread
    await this._commentRepository.checkAvailabilityComment(comment_id);

    // Cek keberadaan balasan yang ingin dihapus
    await this._replyRepository.checkAvailabilityReply(reply_id);

    // Verifikasi apakah user yang mengajukan penghapusan adalah pemilik balasan
    await this._replyRepository.verifyReplyOwner(reply_id, owner);

    // Jika semua validasi lolos, lakukan penghapusan balasan
    await this._replyRepository.deleteReply(reply_id);
  }

  /**
   * Metode privat untuk memvalidasi payload yang dikirimkan untuk penghapusan balasan.
   * Memastikan semua field yang dibutuhkan ada dan bertipe string.
   * @param {object} payload - Data payload yang akan divalidasi
   * @throws Error jika payload tidak lengkap atau tipe data tidak sesuai
   */
  _validatePayload(payload) {
    const { thread_id, comment_id, reply_id, owner } = payload;

    // Cek apakah semua field yang dibutuhkan ada
    if (!thread_id || !comment_id || !reply_id || !owner) {
      // Jika ada yang kosong atau tidak ada, lempar error dengan pesan spesifik
      throw new Error("DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD");
    }

    // Cek tipe data setiap field harus string
    if (
      typeof thread_id !== "string" ||
      typeof comment_id !== "string" ||
      typeof reply_id !== "string" ||
      typeof owner !== "string"
    ) {
      // Jika tipe data tidak sesuai, lempar error dengan pesan spesifik
      throw new Error(
        "DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

// Ekspor kelas ReplyUseCase agar bisa digunakan di modul lain
module.exports = ReplyUseCase;
