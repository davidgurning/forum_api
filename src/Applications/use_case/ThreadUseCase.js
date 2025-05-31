// Import entitas yang merepresentasikan objek bisnis domain threads, comments, dan replies
const AddThread = require("../../Domains/threads/entities/AddThread");
const GetComments = require("../../Domains/comments/entities/GetComments");
const GetReplies = require("../../Domains/replies/entities/GetReplies");

/**
 * Kelas ThreadUseCase bertanggung jawab untuk mengelola proses bisnis terkait thread diskusi.
 * Use case ini menyediakan fitur utama:
 * 1. Menambahkan thread baru ke sistem
 * 2. Mendapatkan data thread lengkap beserta komentar dan balasannya (replies) yang terstruktur dengan baik.
 */
class ThreadUseCase {
  /**
   * Konstruktor kelas ThreadUseCase
   * @param {object} dependencies - Objek berisi dependensi yang dibutuhkan
   * @param {object} dependencies.threadRepository - Repository untuk operasi data thread
   * @param {object} dependencies.commentRepository - Repository untuk operasi data komentar
   * @param {object} dependencies.replyRepository - Repository untuk operasi data balasan (reply)
   */
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  /**
   * Menambahkan thread baru ke sistem.
   * Proses:
   * - Membuat instance entitas AddThread dari payload yang diterima untuk memastikan data valid sesuai domain.
   * - Memanggil repository thread untuk menyimpan thread baru ke penyimpanan data.
   *
   * @param {object} useCasePayload - Data input untuk thread baru (biasanya berisi title, body, owner, dll)
   * @returns {Promise<object>} Mengembalikan hasil penyimpanan thread baru (biasanya berisi id dan informasi thread)
   */
  async addThread(useCasePayload) {
    // Membuat entitas thread baru dengan data yang diterima
    const newThread = new AddThread(useCasePayload);

    // Memanggil repository untuk menyimpan thread dan mengembalikan hasilnya
    return this._threadRepository.addThread(newThread);
  }

  /**
   * Mengambil detail sebuah thread lengkap dengan komentar dan balasannya.
   * Proses:
   * - Validasi ketersediaan thread berdasarkan threadId, jika tidak ada lempar error.
   * - Mengambil data thread dari repository.
   * - Mengambil semua komentar yang berhubungan dengan thread tersebut.
   * - Memproses komentar untuk menyesuaikan format tanggal dan meng-handle kemungkinan komentar yang sudah dihapus.
   * - Mengambil semua balasan yang berhubungan dengan thread tersebut.
   * - Memproses balasan untuk format tanggal dan status penghapusan.
   * - Menggabungkan komentar dan balasan yang terkait berdasarkan comment_id.
   * - Menggunakan entitas GetComments dan GetReplies untuk membungkus data dan menjaga konsistensi format domain.
   * - Mengembalikan objek thread dengan properti comments yang sudah terstruktur lengkap dengan nested replies.
   *
   * @param {string} useCasePayload - threadId yang ingin diambil datanya
   * @returns {Promise<object>} Objek yang berisi data thread lengkap dengan komentar dan balasan
   */
  async getThread(useCasePayload) {
    // Ambil threadId dari parameter
    const threadId = useCasePayload;

    // Cek keberadaan thread, lempar error jika tidak ditemukan
    await this._threadRepository.checkAvailabilityThread(threadId);

    // Ambil data thread secara keseluruhan
    const thread = await this._threadRepository.getThread(threadId);

    // Ambil semua komentar pada thread tersebut
    const comments = await this._commentRepository.getComments(threadId);

    // Proses komentar: format tanggal dan handle deleted_at jika komentar sudah dihapus
    const commentsThread = comments.map((comment) => {
      return {
        id: comment.id,
        username: comment.username,
        content: comment.content,
        // Jika komentar sudah dihapus, tanggal penghapusan dikonversi ke ISO string, kalau tidak null
        deletedAt: comment.deleted_at
          ? new Date(comment.deleted_at).toISOString()
          : null,
        // Tanggal komentar diubah ke ISO string agar konsisten format tanggal
        date: new Date(comment.date).toISOString(),
      };
    });

    // Ambil semua balasan terkait thread
    const replies = await this._replyRepository.getReplies(threadId);

    // Proses balasan: format tanggal dan handle deleted_at (penghapusan balasan)
    const repliesThread = replies.map((reply) => {
      return {
        ...reply,
        deleted_at: reply.deleted_at
          ? new Date(reply.deleted_at).toISOString()
          : null,
        date: new Date(reply.date).toISOString(),
      };
    });

    /**
     * Menggabungkan komentar dan balasan ke dalam struktur nested
     * Proses:
     * - Untuk setiap komentar, filter balasan yang terkait berdasarkan comment_id
     * - Bungkus setiap balasan menggunakan entitas GetReplies untuk format konsisten
     * - Bungkus komentar menggunakan entitas GetComments agar data komentar sesuai dengan format domain
     * - Tambahkan properti replies yang berisi array balasan ke setiap komentar
     */
    const commentsWithReplies = commentsThread.map((comment) => {
      // Filter balasan yang reply ke komentar ini
      const nestedReplies = repliesThread
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => {
          // Bungkus setiap reply dengan entitas GetReplies, ambil elemen pertama (karena array 1 elemen)
          const buildGetReplies = new GetReplies({
            replies: [reply],
          }).replies[0];

          return buildGetReplies;
        });

      // Bungkus komentar dengan entitas GetComments (array 1 elemen)
      const buildGetComment = new GetComments({ comments: [comment] })
        .comments[0];

      // Gabungkan data komentar dengan nested replies
      return {
        ...buildGetComment,
        replies: nestedReplies, // Tambahkan array balasan terkait
      };
    });

    // Kembalikan objek thread lengkap, dengan komentar yang sudah menyertakan balasan terstruktur
    return {
      thread: {
        ...thread,
        comments: commentsWithReplies,
      },
    };
  }
}

// Export kelas ini agar bisa dipakai di modul lain, seperti use case service atau controller API
module.exports = ThreadUseCase;
