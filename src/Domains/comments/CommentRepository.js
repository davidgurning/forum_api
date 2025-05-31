/* eslint-disable no-unused-vars */

// Kelas abstrak CommentRepository ini mendefinisikan kontrak (interface) untuk pengelolaan data komentar.
// Semua method-nya dibuat dengan throw error yang menunjukkan bahwa method tersebut harus diimplementasikan
// oleh kelas turunan yang spesifik, misalnya implementasi repository menggunakan database tertentu.
class CommentRepository {
  // Method untuk menambahkan komentar baru ke dalam repository.
  // Parameter: newComment (objek yang berisi data komentar yang akan disimpan).
  // Karena ini adalah method abstrak, implementasinya harus disediakan oleh kelas turunan.
  async addComment(newComment) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Method untuk mengecek apakah komentar dengan commentId tertentu tersedia (ada) di repository.
  // Parameter: commentId (string id komentar yang ingin dicek).
  // Harus diimplementasikan di kelas turunan.
  async checkAvailabilityComment(commentId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Method untuk memverifikasi apakah user tertentu (owner) adalah pemilik dari komentar dengan commentId.
  // Parameter: commentId (string id komentar), owner (string id user yang mengklaim sebagai pemilik).
  // Harus diimplementasikan di kelas turunan.
  async verifyCommentOwner(commentId, owner) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Method untuk menghapus komentar dengan commentId tertentu dari repository.
  // Parameter: commentId (string id komentar yang akan dihapus).
  // Harus diimplementasikan di kelas turunan.
  async deleteComment(commentId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Method untuk mengambil daftar komentar berdasarkan threadId.
  // Parameter: threadId (string id thread atau topik yang komentarnya ingin diambil).
  // Harus diimplementasikan di kelas turunan.
  async getComments(threadId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

// Mengekspor kelas CommentRepository agar dapat digunakan sebagai interface / blueprint
// oleh modul lain, khususnya implementasi repository yang spesifik (misal: database SQL, NoSQL, dsb).
module.exports = CommentRepository;
