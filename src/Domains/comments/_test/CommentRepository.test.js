const CommentRepository = require("../CommentRepository");

describe("CommentRepository Interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Membuat instance dari CommentRepository
    // Karena CommentRepository ini adalah interface / abstract class,
    // method-methodnya belum diimplementasikan,
    // jadi saat method-method ini dipanggil, harusnya melempar error
    const commentRepository = new CommentRepository();

    // Memastikan bahwa saat memanggil addComment tanpa implementasi,
    // error dengan pesan 'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED' dilempar
    await expect(commentRepository.addComment({})).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    // Memastikan bahwa saat memanggil checkAvailabilityComment tanpa implementasi,
    // error dilempar dengan pesan yang sama
    await expect(
      commentRepository.checkAvailabilityComment({})
    ).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    // Memastikan verifyCommentOwner juga melempar error yang sama
    await expect(commentRepository.verifyCommentOwner({})).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    // Memastikan deleteComment melempar error yang sama jika belum diimplementasi
    await expect(commentRepository.deleteComment({})).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    // Memastikan getComments melempar error yang sama
    await expect(commentRepository.getComments("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
