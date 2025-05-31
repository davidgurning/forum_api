/* eslint-disable no-unused-vars */

// Kelas abstract/interface ReplyRepository sebagai blueprint untuk repository reply.
// Kelas ini mendefinisikan method-method penting yang harus diimplementasikan oleh kelas turunan.
// Biasanya digunakan dalam pola Repository untuk memisahkan logika akses data dengan business logic.
class ReplyRepository {
  /**
   * Menambahkan balasan baru ke dalam penyimpanan data (misal database).
   * @param {Object} newReply - Data balasan yang ingin ditambahkan.
   * @throws Error jika method ini belum diimplementasikan di kelas turunan.
   * @returns {Promise} Resolusi promise yang berisi hasil penambahan balasan.
   */
  async addReply(newReply) {
    // Jika method ini dipanggil tanpa diimplementasikan, lempar error ini.
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Memeriksa ketersediaan balasan berdasarkan replyId.
   * Berguna untuk memastikan balasan dengan ID tersebut ada di database.
   * @param {string} replyId - ID balasan yang akan dicek.
   * @throws Error jika method ini belum diimplementasikan di kelas turunan.
   * @returns {Promise<boolean>} Resolusi promise yang mengindikasikan ada/tidaknya balasan.
   */
  async checkAvailabilityReply(replyId) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Memverifikasi apakah pemilik balasan (owner) sesuai dengan data pada balasan.
   * Berguna untuk otorisasi, memastikan hanya pemilik yang dapat mengubah/menghapus balasan.
   * @param {string} replyId - ID balasan yang akan diverifikasi.
   * @param {string} owner - ID user yang ingin diverifikasi sebagai pemilik balasan.
   * @throws Error jika method ini belum diimplementasikan di kelas turunan.
   * @returns {Promise<boolean>} Resolusi promise yang menunjukkan apakah owner sesuai.
   */
  async verifyReplyOwner(replyId, owner) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Menghapus balasan berdasarkan ID-nya.
   * Biasanya implementasi melakukan soft delete (menandai balasan sebagai dihapus).
   * @param {string} replyId - ID balasan yang akan dihapus.
   * @throws Error jika method ini belum diimplementasikan di kelas turunan.
   * @returns {Promise} Resolusi promise setelah balasan berhasil dihapus.
   */
  async deleteReply(replyId) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Mengambil daftar balasan yang terkait dengan thread tertentu.
   * @param {string} threadId - ID thread untuk mendapatkan semua balasan terkait.
   * @throws Error jika method ini belum diimplementasikan di kelas turunan.
   * @returns {Promise<Array>} Resolusi promise yang berisi array balasan.
   */
  async getReplies(threadId) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

// Mengekspor class ReplyRepository agar bisa digunakan sebagai interface oleh kelas lain.
module.exports = ReplyRepository;
