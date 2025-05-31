// Import helper untuk operasi database testing pada tabel users, threads, comments, dan replies
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");

// Import entity domain untuk reply (AddReply untuk input, AddedReply untuk output)
const AddReply = require("../../../Domains/replies/entities/AddReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");

// Import error class untuk penanganan error spesifik
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

// Import koneksi pool postgres untuk akses database
const pool = require("../../database/postgres/pool");

// Import repository reply yang akan diuji
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe("ReplyRepositoryPostgres", () => {
  // Test awal memastikan instance yang dibuat adalah kelas ReplyRepositoryPostgres
  it("should be instance of ReplyRepository domain", () => {
    // Membuat instance repository tanpa dependensi (dummy)
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {});

    // Mengecek bahwa objek yang dibuat benar instance dari kelas ReplyRepositoryPostgres
    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepositoryPostgres);
  });

  // Setelah tiap test selesai, bersihkan semua tabel terkait agar test tidak saling pengaruh
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable(); // Bersihkan data user
    await ThreadsTableTestHelper.cleanTable(); // Bersihkan data thread
    await CommentsTableTestHelper.cleanTable(); // Bersihkan data comment
    await RepliesTableTestHelper.cleanTable(); // Bersihkan data reply
  });

  // Setelah semua test selesai, tutup koneksi pool ke database postgres
  afterAll(async () => {
    await pool.end();
  });

  // Fungsi helper untuk menyediakan data dummy yang lengkap untuk user, thread, comment, dan reply
  const getPayloadDummy = () => {
    // Data user dummy dengan id dan username
    const userPayload = {
      id: "user-123",
      username: "dicoding",
    };

    // Data thread dummy dengan id, title, body dan owner user
    const threadPayload = {
      id: "thread-123",
      title: "Dummy thread title",
      body: "Dummy thread body",
      owner: userPayload.id,
    };

    // Data comment dummy dengan id, isi konten, thread id, dan owner user
    const commentPayload = {
      id: "comment-123",
      content: "Dummy content of comment",
      thread_id: threadPayload.id,
      owner: userPayload.id,
    };

    // Data reply dummy dengan id, thread id, comment id, isi konten, dan owner user
    const replyPayload = {
      id: "reply-123",
      thread_id: threadPayload.id,
      comment_id: commentPayload.id,
      content: "Dummy content of reply",
      owner: userPayload.id,
    };

    // Mengembalikan semua payload dummy sebagai objek untuk dipakai di test
    return {
      userPayload,
      threadPayload,
      commentPayload,
      replyPayload,
    };
  };

  // Kelompok test untuk fungsi addReply yang berfungsi menambah reply baru ke database
  describe("addReply function", () => {
    it("should persist new reply and return added reply correctly", async () => {
      // Fake id generator agar id yang dihasilkan selalu '123' untuk prediktabilitas test
      const fakeIdGenerator = () => "123";

      // Membuat instance ReplyRepositoryPostgres dengan pool dan fakeIdGenerator
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Mendapatkan data dummy lengkap
      const { userPayload, threadPayload, commentPayload, replyPayload } =
        getPayloadDummy();

      // Menambahkan user, thread, comment ke database sebelum reply dibuat (karena ada FK)
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);

      // Membuat objek AddReply (entitas input) dengan data reply yang ingin ditambahkan
      const replyData = new AddReply({
        thread_id: threadPayload.id,
        comment_id: commentPayload.id,
        content: replyPayload.content,
        owner: userPayload.id,
      });

      // Memanggil fungsi addReply pada repository yang harusnya menyimpan reply dan mengembalikan AddedReply
      const addedReply = await replyRepositoryPostgres.addReply(replyData);

      // Memastikan objek yang dikembalikan sesuai dengan entitas AddedReply dengan id, content, owner yang sama
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: replyPayload.id,
          content: replyPayload.content,
          owner: userPayload.id,
        })
      );

      // Mengecek langsung di tabel replies apakah data reply yang disimpan ada
      const reply = await RepliesTableTestHelper.findRepliesById("reply-123");

      // Memastikan reply ditemukan dan bentuknya adalah array dengan objek di dalamnya
      expect(reply).toHaveLength(1);
      expect(reply).toEqual(expect.any(Array));
      expect(reply[0]).toEqual(expect.any(Object));

      // Pastikan properti 'id' reply adalah string (valid)
      expect(reply[0]).toHaveProperty("id", expect.any(String));
    });
  });

  // Kelompok test untuk fungsi checkAvailabilityReply untuk memastikan reply ada di DB
  describe("checkAvailabilityReply function", () => {
    it("should throw NotFoundError if reply not available", async () => {
      // Instance repository dengan pool dan dummy idGenerator (tidak dipakai)
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const reply = "reply-123";

      // Jika reply tidak ada di DB, fungsi ini harus melempar error NotFoundError
      await expect(
        replyRepositoryPostgres.checkAvailabilityReply(reply)
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError if reply available", async () => {
      // Instance repository
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Siapkan data dummy lengkap
      const { userPayload, threadPayload, commentPayload, replyPayload } =
        getPayloadDummy();

      // Tambahkan data user, thread, comment, dan reply ke DB agar reply tersedia
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);
      await RepliesTableTestHelper.addReply(replyPayload);

      // Pastikan fungsi tidak melempar error NotFoundError jika reply ada
      await expect(
        replyRepositoryPostgres.checkAvailabilityReply("reply-123")
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  // Kelompok test untuk fungsi verifyReplyOwner yang mengecek apakah user adalah pemilik reply
  describe("verifyReplyOwner function", () => {
    it("should throw AuthorizationError if reply not belong to owner", async () => {
      // Instance repository
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Siapkan data dummy dan simpan ke DB
      const { userPayload, threadPayload, commentPayload, replyPayload } =
        getPayloadDummy();

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);
      await RepliesTableTestHelper.addReply(replyPayload);

      // Tambahkan user lain yang bukan pemilik reply
      await UsersTableTestHelper.addUser({
        id: "user-124",
        username: "sitoruszs",
      });
      const owner = "user-124"; // user ini bukan owner reply-123

      // Fungsi harus melempar AuthorizationError karena user bukan pemilik reply
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", owner)
      ).rejects.toThrow(AuthorizationError);
    });

    it("should not throw AuthorizationError if reply is belongs to owner", async () => {
      // Instance repository
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Siapkan dan simpan data dummy reply
      const { userPayload, threadPayload, commentPayload, replyPayload } =
        getPayloadDummy();

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);
      await RepliesTableTestHelper.addReply(replyPayload);

      // Fungsi tidak boleh melempar error jika user adalah pemilik reply
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", "user-123")
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  // Kelompok test untuk fungsi deleteReply yang menghapus reply dari database (soft delete)
  describe("deleteReply", () => {
    it("should delete reply from database", async () => {
      // Instance repository
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Siapkan dan simpan data dummy
      const { userPayload, threadPayload, commentPayload, replyPayload } =
        getPayloadDummy();

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);
      await RepliesTableTestHelper.addReply(replyPayload);

      // Panggil fungsi deleteReply untuk menghapus reply-123 (soft delete dengan update deleted_at)
      await replyRepositoryPostgres.deleteReply("reply-123");

      // Cek apakah kolom deleted_at pada reply-123 sudah terisi dengan tanggal (berarti berhasil soft delete)
      const isReplyDeleted =
        await RepliesTableTestHelper.checkDeletedAtRepliesById("reply-123");

      // Pastikan nilai deleted_at adalah instance Date (tanggal valid)
      expect(isReplyDeleted).toBeInstanceOf(Date);
      // Pastikan properti deleted_at tidak null (sudah diisi)
      expect(isReplyDeleted).not.toBeNull();
      // Pastikan deleted_at adalah tanggal yang valid
      expect(isReplyDeleted).toBeDefined();
    });
  });

  // Kelompok test untuk fungsi getReplies yang mengambil daftar reply berdasarkan thread id
  describe("getRepliesThread", () => {
    it("should get replies from threads based on comments", async () => {
      // Instance repository
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Siapkan dan simpan data dummy lengkap
      const { userPayload, threadPayload, commentPayload, replyPayload } =
        getPayloadDummy();

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);
      await RepliesTableTestHelper.addReply(replyPayload);

      // Ambil reply yang terkait dengan thread tertentu
      const replies = await replyRepositoryPostgres.getReplies(
        threadPayload.id
      );

      // Pastikan hasil adalah array
      expect(replies).toEqual(expect.any(Array));
      // Pastikan id reply sesuai data dummy
      expect(replies[0].id).toEqual(replyPayload.id);
      // Pastikan reply terkait dengan comment yang benar
      expect(replies[0].comment_id).toEqual(commentPayload.id);
      expect(replies[0].thread_id).toEqual(threadPayload.id);
      // Pastikan username owner reply benar
      expect(replies[0].username).toEqual(userPayload.username);
      // Pastikan tanggal reply ada (date terisi)
      expect(replies[0].date).toBeDefined();
      // Pastikan isi konten reply sesuai dummy
      expect(replies[0].content).toEqual("Dummy content of reply");
      // Pastikan reply belum dihapus (deleted_at masih null)
      expect(replies[0].deleted_at).toBeNull();
    });
  });
});
