// Import helper test untuk tabel Threads, Users, dan Comments agar dapat manipulasi data testing
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

// Import interface CommentRepository domain sebagai kontrak yang harus diikuti repository implementasi
const CommentRepository = require("../../../Domains/comments/CommentRepository");

// Import implementasi repository CommentRepository yang menggunakan PostgreSQL
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

// Import koneksi pool PostgreSQL agar bisa query ke database saat testing
const pool = require("../../database/postgres/pool");

// Import entity AddComment yang merepresentasikan data input saat menambahkan komentar
const AddComment = require("../../../Domains/comments/entities/AddComment");

// Import entity AddedComment yang merepresentasikan data komentar setelah berhasil ditambahkan
const AddedComment = require("../../../Domains/comments/entities/AddedComment");

// Import error khusus untuk pengecekan authorization (misal user bukan owner komentar)
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

// Import error khusus untuk pengecekan keberadaan data (misal komentar tidak ditemukan)
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

// Suite test utama untuk class CommentRepositoryPostgres
describe("CommentRepositoryPostgres", () => {
  // Test dasar, memeriksa object repository sudah terdefinisi dan instance dari interface domain
  it("should be defined and instance of CommentRepository domain", () => {
    // Membuat instance dengan dependency kosong untuk cek instansiasi
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    // Pastikan objek repository tidak undefined/null
    expect(commentRepositoryPostgres).toBeDefined();
    // Pastikan objek repository merupakan instance dari CommentRepository (interface)
    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  // Hook afterEach dijalankan setelah setiap test case untuk bersihkan data user, thread, dan komentar
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable(); // Bersihkan tabel users
    await ThreadsTableTestHelper.cleanTable(); // Bersihkan tabel threads
    await CommentsTableTestHelper.cleanTable(); // Bersihkan tabel comments
  });

  // Hook afterAll dijalankan sekali setelah semua test selesai, untuk menutup koneksi pool database
  afterAll(async () => {
    await pool.end();
  });

  // Data dummy untuk user, thread, dan comment yang dipakai berulang di banyak test
  const addUserPayload = {
    id: "user-123", // ID unik user
    username: "dicoding", // Username user
  };

  const addThreadPayload = {
    id: "thread-123", // ID unik thread
    body: "Dummy thread body", // Isi body thread
    owner: addUserPayload.id, // Owner thread adalah user dengan id "user-123"
  };

  const addCommentPayload = {
    content: "Dummy content of comment", // Isi komentar
    thread_id: addThreadPayload.id, // ID thread tempat komentar ini dibuat
    owner: addUserPayload.id, // Owner komentar adalah user dengan id "user-123"
  };

  // Suite test untuk fungsi addComment pada repository
  describe("addComment function", () => {
    it("should persist new comment and return added comment correctly", async () => {
      // Arrange: tambah user dan thread dummy ke database supaya foreign key valid
      await UsersTableTestHelper.addUser(addUserPayload);
      await ThreadsTableTestHelper.addThread(addThreadPayload);

      // Buat instance entity AddComment dari payload dummy sebagai input fungsi addComment
      const newComment = new AddComment(addCommentPayload);

      // Fake id generator untuk memastikan id komentar predictable (selalu "123")
      const fakeIdGenerator = () => "123";

      // Buat instance CommentRepositoryPostgres dengan pool dan fakeIdGenerator
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Act: panggil addComment, simpan hasilnya ke addedComment
      const addedComment = await commentRepositoryPostgres.addComment(
        newComment
      );

      // Assert: pastikan returned object sesuai entity AddedComment dengan id "comment-123"
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "Dummy content of comment",
          owner: "user-123",
        })
      );

      // Verifikasi data komentar benar-benar tersimpan di database
      const comment = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      // Pastikan ada 1 data komentar dengan id tersebut di DB
      expect(comment).toHaveLength(1);
    });
  });

  // Suite test untuk fungsi checkAvailabilityComment yang mengecek keberadaan komentar
  describe("checkAvailabilityComment function", () => {
    // Jika komentar tidak ada, harus melempar NotFoundError
    it("should throw NotFoundError if comment not available", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = "123";

      // Assert: cek bahwa fungsi menolak dengan NotFoundError jika komentar tidak ada
      await expect(
        commentRepositoryPostgres.checkAvailabilityComment(commentId)
      ).rejects.toThrow(NotFoundError);
    });

    // Jika komentar tersedia, fungsi tidak boleh melempar error
    it("should not throw NotFoundError if comment available", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Tambah user, thread, dan komentar dummy ke DB agar tersedia
      await UsersTableTestHelper.addUser(addUserPayload);
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);

      // Assert: cek fungsi tidak melempar error saat komentar ditemukan
      await expect(
        commentRepositoryPostgres.checkAvailabilityComment("comment-123")
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  // Suite test untuk fungsi verifyCommentOwner yang mengecek apakah user adalah owner komentar
  describe("verifyCommentOwner function", () => {
    // Jika user bukan owner komentar, harus melempar AuthorizationError
    it("should throw AuthorizationError if comment not belong to owner", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Tambah dua user berbeda ke DB
      await UsersTableTestHelper.addUser(addUserPayload); // user-123
      await UsersTableTestHelper.addUser({
        id: "user-124",
        username: "sitoruszs",
      });

      // Tambah thread dan komentar dengan owner user-123
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);

      const userId = "user-124"; // User kedua yang bukan owner komentar

      // Assert: cek fungsi melempar AuthorizationError jika user bukan owner komentar
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-123", userId)
      ).rejects.toThrow(AuthorizationError);
    });

    // Jika user adalah owner komentar, tidak boleh melempar error
    it("should not throw AuthorizationError if comment is belongs to owner", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Tambah user, thread, dan komentar dengan owner user-123
      await UsersTableTestHelper.addUser(addUserPayload);
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);

      // Assert: cek fungsi tidak melempar error saat user adalah owner komentar
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-123", "user-123")
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  // Suite test untuk fungsi deleteComment yang menghapus komentar secara soft delete (update deleted_at)
  describe("deleteComment function", () => {
    it("should delete comment from database", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Setup data user, thread, dan komentar dummy terlebih dahulu
      await UsersTableTestHelper.addUser(addUserPayload);
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);

      // Act: panggil deleteComment dengan id komentar yang ingin dihapus
      await commentRepositoryPostgres.deleteComment("comment-123");

      // Query untuk cek nilai deleted_at pada komentar yang dihapus
      const deletedAt =
        await CommentsTableTestHelper.checkdeletedAtCommentsById("comment-123");

      // Assert: pastikan nilai deleted_at tidak null (menandakan komentar sudah dihapus secara soft delete)
      expect(deletedAt).not.toBeNull();
      // Pastikan deleted_at adalah Date object
      expect(deletedAt).toBeInstanceOf(Date);
      expect(deletedAt).toBeTruthy(); // memastikan ada nilai
    });
  });

  // Suite test untuk fungsi getComments yang mengambil daftar komentar pada sebuah thread
  describe("getComments function", () => {
    it("should get comments of thread", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Setup data user, thread, dan komentar terlebih dahulu
      await UsersTableTestHelper.addUser(addUserPayload);
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);

      // Act: panggil getComments untuk thread tertentu
      const comments = await commentRepositoryPostgres.getComments(
        addThreadPayload.id
      );

      // Assert: hasil harus berupa array
      expect(Array.isArray(comments)).toBe(true);

      // Pastikan komentar pertama sesuai dengan data dummy yang sudah dibuat
      expect(comments[0].id).toEqual("comment-123");
      expect(comments[0].thread_id).toEqual("thread-123");
      expect(comments[0].username).toEqual("dicoding");
      expect(comments[0].content).toEqual("Dummy content of comment");
      expect(comments[0].deleted_at).toBeNull(); // komentar belum dihapus (deleted_at null)
      // Assert property date dan nilainya
      expect(comments[0]).toHaveProperty("date"); // ada properti date (tanggal pembuatan)
      expect(comments[0].date).toBeTruthy(); // pastikan date memiliki nilai
      expect(comments[0].date).toBeInstanceOf(Date); // pastikan date adalah Date object
    });
  });
});
