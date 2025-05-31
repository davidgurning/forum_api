// Mengimpor use case utama untuk komentar
const CommentUseCase = require("../CommentUseCase");
// Mengimpor entity yang mewakili komentar yang sudah berhasil ditambahkan
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
// Mengimpor entity yang mewakili data komentar baru yang akan ditambahkan
const AddComment = require("../../../Domains/comments/entities/AddComment");
// Mengimpor interface repository thread untuk pengecekan thread terkait komentar
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
// Mengimpor interface repository komentar untuk operasi komentar (add, delete, verify, dll)
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("CommentUseCase class", () => {
  // Test sederhana untuk memastikan class CommentUseCase terdefinisi dan bisa diinstansiasi
  it("should be defined", async () => {
    const commentUseCase = new CommentUseCase({});
    expect(commentUseCase).toBeDefined();
  });

  // Mengelompokkan test untuk fungsi addComment
  describe("addComment function", () => {
    // Memastikan fungsi addComment terdefinisi di dalam CommentUseCase
    it("should be defined", () => {
      const commentUseCase = new CommentUseCase({});
      expect(commentUseCase.addComment).toBeDefined();
    });

    // Test utama yang menguji alur kerja penambahan komentar secara benar
    it("should orchestrating the add comment action correctly", async () => {
      // Arrange: data payload yang berisi ID thread, isi komentar, dan owner (user yang komen)
      const useCasePayload = {
        thread_id: "thread-123",
        content: "Dummy content of comment",
        owner: "user-123",
      };

      // Membuat mock objek AddedComment sebagai hasil yang diharapkan dari proses penambahan komentar
      const mockAddedComment = new AddedComment({
        id: "comment-123",
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      });

      // Membuat mock repository thread dan comment
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      // Mock method checkAvailabilityThread untuk memastikan thread ada
      mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
        Promise.resolve()
      );

      // Mock method addComment untuk menambahkan komentar dan mengembalikan objek AddedComment
      mockCommentRepository.addComment = jest.fn(() =>
        Promise.resolve(mockAddedComment)
      );

      // Membuat instance CommentUseCase dengan dependency repository yang sudah di-mock
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Act: Memanggil fungsi addComment dengan payload
      const addedComment = await commentUseCase.addComment(useCasePayload);

      // Assert:
      // Memastikan method checkAvailabilityThread dipanggil dengan thread_id yang benar
      expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
        useCasePayload.thread_id
      );

      // Memastikan method addComment dipanggil dengan objek AddComment yang berisi data komentar lengkap
      expect(mockCommentRepository.addComment).toBeCalledWith(
        new AddComment({
          thread_id: useCasePayload.thread_id,
          content: useCasePayload.content,
          owner: useCasePayload.owner,
        })
      );

      // Memastikan hasil fungsi addComment sesuai dengan objek AddedComment yang sudah di-mock
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: useCasePayload.content,
          owner: useCasePayload.owner,
        })
      );
    });
  });

  // Mengelompokkan test untuk fungsi deleteComment
  describe("deleteComment function", () => {
    // Memastikan fungsi deleteComment terdefinisi
    it("should be defined", () => {
      const commentUseCase = new CommentUseCase({});
      expect(commentUseCase.deleteComment).toBeDefined();
    });

    // Test validasi error ketika payload tidak lengkap (tidak mengandung data yang diperlukan)
    it("should throw error if use case payload did not contain all data needed", async () => {
      // Payload yang tidak lengkap (thread_id tidak valid karena boolean)
      const useCasePayload = {
        thread_id: true,
        comment_id: "comment-123",
      };
      const commentUseCase = new CommentUseCase({});

      // Mengharapkan fungsi deleteComment menolak dengan error khusus
      await expect(
        commentUseCase.deleteComment(useCasePayload)
      ).rejects.toThrowError(
        "DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD"
      );
    });

    // Test validasi error jika tipe data payload tidak sesuai spesifikasi
    it("should throw error if payload did not meet data type specification", async () => {
      // Payload dengan tipe data salah (owner harus string tapi diberi angka)
      const useCasePayload = {
        thread_id: true,
        comment_id: "comment-123",
        owner: 123,
      };
      const commentUseCase = new CommentUseCase({});
      await expect(
        commentUseCase.deleteComment(useCasePayload)
      ).rejects.toThrowError(
        "DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    });

    // Test utama yang menguji alur kerja penghapusan komentar secara benar
    it("should orchestrating the delete comment action correctly", async () => {
      // Payload lengkap dan valid untuk delete comment
      const useCasePayload = {
        thread_id: "thread-123",
        comment_id: "comment-123",
        owner: "user-123",
      };

      // Mock repository untuk komentar dan thread
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      // Mock method untuk pengecekan keberadaan thread
      mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
        Promise.resolve()
      );
      // Mock method untuk pengecekan keberadaan komentar
      mockCommentRepository.checkAvailabilityComment = jest.fn(() =>
        Promise.resolve()
      );
      // Mock method untuk verifikasi kepemilikan komentar oleh user
      mockCommentRepository.verifyCommentOwner = jest.fn(() =>
        Promise.resolve()
      );
      // Mock method untuk menghapus komentar
      mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

      // Membuat instance CommentUseCase dengan dependency yang sudah di-mock
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Act: Memanggil fungsi deleteComment dengan payload
      await commentUseCase.deleteComment(useCasePayload);

      // Assert: Memastikan seluruh fungsi mock terpanggil dengan parameter yang sesuai
      expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
        useCasePayload.thread_id
      );
      expect(
        mockCommentRepository.checkAvailabilityComment
      ).toHaveBeenCalledWith(useCasePayload.comment_id);
      expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
        useCasePayload.comment_id,
        useCasePayload.owner
      );
      expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
        useCasePayload.comment_id
      );
    });
  });
});
