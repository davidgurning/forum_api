// Mengimpor kelas ThreadUseCase yang berisi logika utama untuk operasi thread
const ThreadUseCase = require("../ThreadUseCase");

// Mengimpor entitas AddThread, yang merepresentasikan data thread baru yang akan dibuat
const AddThread = require("../../../Domains/threads/entities/AddThread");

// Mengimpor entitas AddedThread, yang merepresentasikan data thread yang sudah berhasil dibuat dan ditambahkan ke penyimpanan
const AddedThread = require("../../../Domains/threads/entities/AddedThread");

// Mengimpor entitas GetThread, yang merepresentasikan data detail sebuah thread beserta atributnya
const GetThread = require("../../../Domains/threads/entities/GetThread");

// Mengimpor repository thread sebagai interface untuk interaksi dengan data thread (biasanya database)
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

// Mengimpor repository komentar sebagai interface untuk interaksi data komentar thread
const CommentRepository = require("../../../Domains/comments/CommentRepository");

// Mengimpor repository reply sebagai interface untuk interaksi data balasan komentar
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

// Memulai blok pengujian untuk kelas ThreadUseCase
describe("ThreadUseCase", () => {
  // Blok pengujian khusus untuk fungsi addThread
  describe("addThread function", () => {
    // Mendefinisikan sebuah skenario pengujian async
    it("should orchestrating the add thread function correctly", async () => {
      // Arrange (persiapan data dan mock)
      const useCasePayload = {
        title: "Dummy thread title", // Judul thread dummy
        body: "Dummy thread body", // Isi/body thread dummy
        owner: "user-123", // ID pemilik thread dummy
      };

      // Membuat mock objek AddedThread sebagai hasil yang diharapkan dari fungsi addThread
      const mockAddedThread = new AddedThread({
        id: "thread-123", // ID thread dummy yang di-generate setelah pembuatan
        title: useCasePayload.title, // Judul thread sesuai payload
        body: useCasePayload.body, // Body thread sesuai payload
        owner: useCasePayload.owner, // Owner sesuai payload
      });

      // Membuat instance mock dari ThreadRepository
      const mockThreadRepository = new ThreadRepository();

      // Mem-override method addThread pada mockThreadRepository menggunakan jest.fn untuk membuat fungsi mock yang mengembalikan Promise resolved dengan mockAddedThread
      mockThreadRepository.addThread = jest.fn(() =>
        Promise.resolve(mockAddedThread)
      );

      // Membuat instance ThreadUseCase dengan repository mock sebagai dependency injection
      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository, // Memasukkan mock repository thread
        commentRepository: {}, // Repository komentar kosong karena tidak digunakan di test ini
        replyRepository: {}, // Repository reply kosong karena tidak digunakan di test ini
      });

      // Action: Memanggil fungsi addThread dengan payload dummy dan menunggu hasilnya
      const addedThread = await getThreadUseCase.addThread(useCasePayload);

      // Assert: Mengecek bahwa output yang didapat sama persis dengan mockAddedThread yang diharapkan
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: useCasePayload.title,
          body: useCasePayload.body,
          owner: useCasePayload.owner,
        })
      );

      // Assert: Mengecek bahwa method addThread pada repository dipanggil dengan objek AddThread yang sesuai payload
      expect(mockThreadRepository.addThread).toBeCalledWith(
        new AddThread({
          title: useCasePayload.title,
          body: useCasePayload.body,
          owner: useCasePayload.owner,
        })
      );
    });
  });

  // Blok pengujian untuk fungsi getThread (mengambil detail thread)
  describe("getThread function", () => {
    // Skenario pengujian: Mengambil detail thread dengan komentar dan balasan yang tidak dihapus
    it("should get return detail thread correctly", async () => {
      // Arrange (persiapan data dummy thread, komentar, dan balasan)
      const expectedThread = new GetThread({
        id: "thread-123",
        title: "Dummy thread title",
        body: "Dummy thread body",
        date: "2025-05-23T01:01:01.001Z", // Tanggal pembuatan thread dalam format ISO
        username: "dicoding",
      });

      // Array dummy komentar terkait thread
      const expectedComments = [
        {
          id: "comment-123",
          content: "Dummy content of comment",
          username: "dicoding",
          thread_id: "thread-123",
          date: "2025-05-23T01:01:01.001Z",
          deleted_at: null, // null berarti komentar belum dihapus
        },
        {
          id: "comment-124",
          content: "Dummy content of comment",
          username: "sitoruszs",
          thread_id: "thread-123",
          date: "2025-05-24T01:01:01.001Z",
          deleted_at: null,
        },
      ];

      // Array dummy balasan komentar terkait thread
      const expectedReplies = [
        {
          id: "reply-123",
          content: "Dummy content of reply",
          date: "2025-05-24T01:01:01.001Z",
          username: "dicoding",
          comment_id: "comment-124",
          deleted_at: null,
        },
        {
          id: "reply-124",
          content: "Dummy content of reply",
          date: "2025-05-25T01:01:01.001Z",
          username: "dicoding",
          comment_id: "comment-124",
          deleted_at: null,
        },
      ];

      // Test Doubles: Membuat mock repository untuk thread, komentar, dan reply
      const threadId = "thread-123";
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      // Mock method checkAvailabilityThread yang akan memastikan thread ada, mengembalikan Promise resolve tanpa nilai (berhasil)
      mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
        Promise.resolve()
      );

      // Mock method getThread yang mengembalikan data thread dummy
      mockThreadRepository.getThread = jest.fn(() =>
        Promise.resolve(expectedThread)
      );

      // Mock method getComments yang mengembalikan array komentar dummy
      mockCommentRepository.getComments = jest.fn(() =>
        Promise.resolve(expectedComments)
      );

      // Mock method getReplies yang mengembalikan array balasan dummy
      mockReplyRepository.getReplies = jest.fn(() =>
        Promise.resolve(expectedReplies)
      );

      // Membuat instance ThreadUseCase dengan ketiga repository mock
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action: Memanggil method getThread dengan threadId dummy
      const detailThread = await threadUseCase.getThread(threadId);

      // Assert: Memastikan fungsi-fungsi repository dipanggil dengan parameter yang benar
      expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
        threadId
      );

      expect(mockThreadRepository.getThread).toHaveBeenCalledWith(threadId);
      expect(mockCommentRepository.getComments).toHaveBeenCalledWith(threadId);
      expect(mockReplyRepository.getReplies).toHaveBeenCalledWith(threadId);

      // Assert: Mengecek apakah detail thread sudah sesuai format output yang diharapkan
      // Struktur output mengandung thread utama beserta komentar dan reply-nya di dalamnya
      expect(detailThread).toStrictEqual({
        thread: {
          id: "thread-123",
          title: "Dummy thread title",
          body: "Dummy thread body",
          date: "2025-05-23T01:01:01.001Z",
          username: "dicoding",
          comments: [
            {
              id: "comment-123",
              username: "dicoding",
              date: "2025-05-23T01:01:01.001Z",
              content: "Dummy content of comment",
              replies: [], // Komentar ini tidak memiliki balasan
            },
            {
              id: "comment-124",
              username: "sitoruszs",
              date: "2025-05-24T01:01:01.001Z",
              content: "Dummy content of comment",
              replies: [
                {
                  id: "reply-123",
                  username: "dicoding",
                  date: "2025-05-24T01:01:01.001Z",
                  content: "Dummy content of reply",
                },
                {
                  id: "reply-124",
                  content: "Dummy content of reply",
                  date: "2025-05-25T01:01:01.001Z",
                  username: "dicoding",
                },
              ],
            },
          ],
        },
      });
    });

    // Skenario pengujian: Mendapatkan detail thread ketika terdapat komentar yang sudah dihapus
    it("should get return detail thread correctly when there is deleted comment", async () => {
      // Arrange: data thread dan komentar dengan satu komentar sudah dihapus (deleted_at tidak null)
      const expectedThread = new GetThread({
        id: "thread-123",
        title: "Dummy thread title",
        body: "Dummy thread body",
        date: "2025-05-23T01:01:01.001Z",
        username: "dicoding",
      });

      // Komentar pertama normal, komentar kedua sudah dihapus (deleted_at berisi timestamp)
      const expectedComments = [
        {
          id: "comment-123",
          content: "Dummy content of comment",
          username: "dicoding",
          thread_id: "thread-123",
          date: "2025-05-23T01:01:01.001Z",
          deleted_at: null,
        },
        {
          id: "comment-124",
          content: "Dummy content of comment",
          username: "sitoruszs",
          thread_id: "thread-123",
          date: "2025-05-24T01:01:01.001Z",
          deleted_at: "2025-05-26T01:01:01.001Z", // komentar dihapus
        },
      ];

      // Balasan yang berhubungan dengan komentar yang sudah dihapus tetap ada (untuk uji fungsi handling)
      const expectedReplies = [
        {
          id: "reply-123",
          content: "Dummy content of reply",
          date: "2025-05-24T01:01:01.001Z",
          username: "dicoding",
          comment_id: "comment-124",
          deleted_at: null,
        },
        {
          id: "reply-124",
          content: "Dummy content of reply",
          date: "2025-05-25T01:01:01.001Z",
          username: "dicoding",
          comment_id: "comment-124",
          deleted_at: null,
        },
      ];

      // Membuat mock repository dan method-methodnya sesuai kebutuhan pengujian
      const threadId = "thread-123";
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
        Promise.resolve()
      );
      mockThreadRepository.getThread = jest.fn(() =>
        Promise.resolve(expectedThread)
      );
      mockCommentRepository.getComments = jest.fn(() =>
        Promise.resolve(expectedComments)
      );
      mockReplyRepository.getReplies = jest.fn(() =>
        Promise.resolve(expectedReplies)
      );

      // Membuat instance ThreadUseCase dengan repository mock
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action: Memanggil getThread untuk threadId yang diuji
      const detailThread = await threadUseCase.getThread(threadId);

      // Assert: Memastikan repository dipanggil dengan argumen yang tepat
      expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.getThread).toHaveBeenCalledWith(threadId);
      expect(mockCommentRepository.getComments).toHaveBeenCalledWith(threadId);
      expect(mockReplyRepository.getReplies).toHaveBeenCalledWith(threadId);

      // Assert: Memastikan hasil output sudah sesuai dengan harapan ketika ada komentar dihapus
      // Perhatikan konten komentar kedua sudah diganti dengan pesan khusus dan balasan tetap muncul
      expect(detailThread).toStrictEqual({
        thread: {
          id: "thread-123",
          title: "Dummy thread title",
          body: "Dummy thread body",
          date: "2025-05-23T01:01:01.001Z",
          username: "dicoding",
          comments: [
            {
              id: "comment-123",
              username: "dicoding",
              date: "2025-05-23T01:01:01.001Z",
              content: "Dummy content of comment",
              replies: [],
            },
            {
              id: "comment-124",
              username: "sitoruszs",
              date: "2025-05-24T01:01:01.001Z",
              content: "**komentar telah dihapus**", // Konten komentar yang dihapus diganti dengan teks khusus
              replies: [
                {
                  id: "reply-123",
                  username: "dicoding",
                  date: "2025-05-24T01:01:01.001Z",
                  content: "Dummy content of reply",
                },
                {
                  id: "reply-124",
                  content: "Dummy content of reply",
                  date: "2025-05-25T01:01:01.001Z",
                  username: "dicoding",
                },
              ],
            },
          ],
        },
      });
    });

    // Skenario pengujian: Mendapatkan detail thread ketika terdapat balasan yang sudah dihapus
    it("should get return detail thread correctly when there is deleted reply", async () => {
      // Arrange: data thread, komentar dan balasan, dengan salah satu balasan sudah dihapus (deleted_at tidak null)
      const expectedThread = new GetThread({
        id: "thread-123",
        title: "Dummy thread title",
        body: "Dummy thread body",
        date: "2025-05-23T01:01:01.001Z",
        username: "dicoding",
      });

      const expectedComments = [
        {
          id: "comment-123",
          content: "Dummy content of comment",
          username: "dicoding",
          thread_id: "thread-123",
          date: "2025-05-23T01:01:01.001Z",
          deleted_at: null,
        },
        {
          id: "comment-124",
          content: "Dummy content of comment",
          username: "sitoruszs",
          thread_id: "thread-123",
          date: "2025-05-24T01:01:01.001Z",
          deleted_at: null,
        },
      ];

      // Balasan pertama normal, balasan kedua sudah dihapus (deleted_at berisi timestamp)
      const expectedReplies = [
        {
          id: "reply-123",
          content: "Dummy content of reply",
          date: "2025-05-24T01:01:01.001Z",
          username: "dicoding",
          comment_id: "comment-124",
          deleted_at: null,
        },
        {
          id: "reply-124",
          content: "Dummy content of reply",
          date: "2025-05-25T01:01:01.001Z",
          username: "dicoding",
          comment_id: "comment-124",
          deleted_at: "2025-05-26T01:01:01.001Z", // reply dihapus
        },
      ];

      // Mock repository dan method-methodnya
      const threadId = "thread-123";
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
        Promise.resolve()
      );
      mockThreadRepository.getThread = jest.fn(() =>
        Promise.resolve(expectedThread)
      );
      mockCommentRepository.getComments = jest.fn(() =>
        Promise.resolve(expectedComments)
      );
      mockReplyRepository.getReplies = jest.fn(() =>
        Promise.resolve(expectedReplies)
      );

      // Membuat instance ThreadUseCase dengan repository mock
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action: Memanggil getThread dengan threadId yang diuji
      const detailThread = await threadUseCase.getThread(threadId);

      // Assert: Memastikan method-method repository dipanggil dengan argumen tepat
      expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.getThread).toHaveBeenCalledWith(threadId);
      expect(mockCommentRepository.getComments).toHaveBeenCalledWith(threadId);
      expect(mockReplyRepository.getReplies).toHaveBeenCalledWith(threadId);

      // Assert: Memastikan balasan yang dihapus kontennya diganti dengan pesan khusus
      expect(detailThread).toStrictEqual({
        thread: {
          id: "thread-123",
          title: "Dummy thread title",
          body: "Dummy thread body",
          date: "2025-05-23T01:01:01.001Z",
          username: "dicoding",
          comments: [
            {
              id: "comment-123",
              username: "dicoding",
              date: "2025-05-23T01:01:01.001Z",
              content: "Dummy content of comment",
              replies: [],
            },
            {
              id: "comment-124",
              username: "sitoruszs",
              date: "2025-05-24T01:01:01.001Z",
              content: "Dummy content of comment",
              replies: [
                {
                  id: "reply-123",
                  username: "dicoding",
                  date: "2025-05-24T01:01:01.001Z",
                  content: "Dummy content of reply",
                },
                {
                  id: "reply-124",
                  content: "**balasan telah dihapus**", // Konten balasan yang dihapus diganti pesan khusus
                  date: "2025-05-25T01:01:01.001Z",
                  username: "dicoding",
                },
              ],
            },
          ],
        },
      });
    });
  });
});
