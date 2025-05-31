// Mengimpor entitas AddComment yang merepresentasikan data komentar baru
const AddComment = require("../../Domains/comments/entities/AddComment");

class CommentUseCase {
  /**
   * Konstruktor kelas CommentUseCase
   * @param {object} param0 - Objek yang berisi dependency injection
   * @param {object} param0.commentRepository - Repository untuk akses dan manipulasi data komentar di database
   * @param {object} param0.threadRepository - Repository untuk akses dan validasi data thread di database
   */
  constructor({ commentRepository, threadRepository }) {
    // Menyimpan instance commentRepository untuk operasi terkait komentar (tambah, cek, hapus, verifikasi)
    this._commentRepository = commentRepository;

    // Menyimpan instance threadRepository untuk operasi validasi thread (misal cek apakah thread tersedia)
    this._threadRepository = threadRepository;
  }

  /**
   * Use case untuk menambahkan komentar baru ke sebuah thread
   * @param {object} useCasePayload - Data input komentar baru, biasanya berisi thread_id, content, owner, dll
   * @returns {Promise<object>} - Mengembalikan data komentar yang sudah berhasil ditambahkan (misal id, content, owner, tanggal)
   * @throws {Error} - Jika thread tidak tersedia atau validasi gagal
   */
  async addComment(useCasePayload) {
    // Mengambil thread_id dari payload untuk validasi thread terlebih dahulu
    const { thread_id } = useCasePayload;

    // Memanggil repository thread untuk memastikan thread dengan thread_id tersebut ada di database
    // Jika tidak ditemukan, biasanya method ini melempar error (throw)
    await this._threadRepository.checkAvailabilityThread(thread_id);

    // Membuat objek AddComment dari payload untuk melakukan validasi struktur dan aturan data komentar
    const newComment = new AddComment(useCasePayload);

    // Memanggil repository komentar untuk menambahkan komentar baru ke database
    // Mengoper objek newComment yang sudah tervalidasi
    return this._commentRepository.addComment(newComment);
  }

  /**
   * Use case untuk menghapus komentar yang sudah ada
   * @param {object} useCasePayload - Data payload yang harus berisi thread_id, comment_id, dan owner (pemilik komentar)
   * @returns {Promise<void>} - Tidak mengembalikan apa-apa jika berhasil
   * @throws {Error} - Jika payload tidak valid, thread atau komentar tidak tersedia, atau pemilik komentar tidak sesuai
   */
  async deleteComment(useCasePayload) {
    // Validasi struktur dan tipe data payload sebelum proses lebih lanjut
    this._validatePayload(useCasePayload);

    // Mendestruktur properti penting dari payload
    const { thread_id, comment_id, owner } = useCasePayload;

    // Memastikan thread dengan thread_id tersebut masih ada (belum dihapus atau tidak ditemukan)
    await this._threadRepository.checkAvailabilityThread(thread_id);

    // Memastikan komentar dengan comment_id tersebut ada di database
    await this._commentRepository.checkAvailabilityComment(comment_id);

    // Memastikan bahwa user yang ingin menghapus komentar ini adalah pemilik komentar sebenarnya
    // Jika bukan, biasanya method ini akan melempar error (seperti UnauthorizedAccess)
    await this._commentRepository.verifyCommentOwner(comment_id, owner);

    // Melakukan penghapusan komentar secara logis atau fisik tergantung implementasi repository
    await this._commentRepository.deleteComment(comment_id);
  }

  /**
   * Method privat untuk memvalidasi payload yang diperlukan pada proses hapus komentar
   * @param {object} payload - Objek payload yang harus berisi thread_id, comment_id, dan owner
   * @throws {Error} - Jika payload tidak lengkap atau tipe data salah
   */
  _validatePayload(payload) {
    const { thread_id, comment_id, owner } = payload;

    // Validasi ada tidaknya ketiga properti wajib dalam payload
    if (!thread_id || !comment_id || !owner) {
      // Melempar error dengan kode khusus yang bisa digunakan untuk debugging dan penanganan error di lapisan lain
      throw new Error("DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD");
    }

    // Validasi tipe data properti harus berupa string
    if (
      typeof thread_id !== "string" ||
      typeof comment_id !== "string" ||
      typeof owner !== "string"
    ) {
      // Melempar error jika tipe data tidak sesuai spesifikasi
      throw new Error(
        "DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

// Mengekspor kelas CommentUseCase agar bisa digunakan oleh modul lain, misalnya service atau controller
module.exports = CommentUseCase;
