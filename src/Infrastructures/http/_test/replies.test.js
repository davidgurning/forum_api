// Import berbagai helper untuk manipulasi dan pembersihan data di database
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

// Import koneksi pool database PostgreSQL
const pool = require("../../database/postgres/pool");

// Import dependency injection container
const container = require("../../container");

// Import fungsi untuk membuat instance server Hapi
const createServer = require("../createServer");

// Grup pengujian endpoint untuk fitur 'replies'
describe("replies endpoint", () => {
  // Setelah semua pengujian selesai, tutup koneksi database
  afterAll(async () => {
    await pool.end();
  });

  // Setelah setiap pengujian, bersihkan tabel replies, comments, threads, dan users
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  // Fungsi bantu untuk mendapatkan token akses dengan cara membuat user dan login
  async function getAccessToken(server) {
    const loginPayload = {
      username: "dicoding",
      password: "kosong123",
    };

    // Register user terlebih dahulu
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding",
        password: "kosong123",
        fullname: "Dicoding Backend",
      },
    });

    // Login dan dapatkan token
    const authentication = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: loginPayload,
    });

    // Ambil access token dari response login
    const responseAuth = JSON.parse(authentication.payload);
    return responseAuth.data.accessToken;
  }

  // Grup pengujian untuk endpoint POST reply
  describe("when POST threads/{threadId}/comments/{commentId}/replies", () => {
    // Test ketika tidak ada access token di header
    it("should response 401 if payload did not have access token in Authorization Header", async () => {
      const server = await createServer(container);

      // Kirim request tanpa header authorization
      const responseReply = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments/comment-123/replies",
        payload: {},
      });

      const responseJson = JSON.parse(responseReply.payload);

      expect(responseReply.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    // Test ketika threadId tidak ditemukan
    it("should response 404 if thread id did not available", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      const responseReply = await server.inject({
        method: "POST",
        url: "/threads/thread-zzz/comments/comment-yyy/replies",
        payload: {
          content: "Dummy content of reply",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(responseReply.payload);

      expect(responseReply.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan!");
    });

    // Test ketika commentId tidak ditemukan di thread yang valid
    it("should response 404 if comment id did not available", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread terlebih dahulu
      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "Dummy thread title",
          body: "Dummy thread body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadResponse = JSON.parse(thread.payload);

      // Kirim reply ke comment yang tidak ada
      const responseReply = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/xxxx/replies`,
        payload: {
          content: "Dummy content of reply",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(responseReply.payload);

      expect(responseReply.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("komentar tidak ditemukan!");
    });

    // Test jika payload tidak mengandung property yang dibutuhkan
    it("should response 400 if payload reply not contain needed property", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread dan comment terlebih dahulu
      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "Dummy thread title",
          body: "Dummy thread body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "Dummy content of comment",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const commentResponse = JSON.parse(comment.payload);

      // Kirim payload kosong
      const responseReply = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(responseReply.payload);

      expect(responseReply.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "gagal membuat reply baru, beberapa properti yang dibutuhkan tidak ada"
      );
    });

    // Test jika tipe data payload tidak sesuai (misalnya content bukan string)
    it("should response 400 if payload not meet data type specification", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread dan comment
      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "Dummy thread title",
          body: "Dummy thread body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "Dummy content of comment",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const commentResponse = JSON.parse(comment.payload);

      // Kirim content bertipe number, bukan string
      const replyResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
        payload: {
          content: 123,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "gagal membuat reply baru, tipe data tidak sesuai"
      );
    });

    // Test jika berhasil menambahkan reply
    it("should response 201 and return addedComment", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread dan comment terlebih dahulu
      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "Dummy thread title",
          body: "Dummy thread body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "Dummy content of comment",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const commentResponse = JSON.parse(comment.payload);

      // Kirim reply valid
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
        payload: {
          content: "Dummy content of reply",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply.content).toEqual(
        "Dummy content of reply"
      );
    });
  });

  // Test cases yang perlu ditambahkan ke describe("replies endpoint") di replies.test.js
  // Letakkan setelah describe("when POST threads/{threadId}/comments/{commentId}/replies")

  describe("when DELETE threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    // Test ketika tidak ada access token di header
    it("should response 401 if payload did not have access token in Authorization Header", async () => {
      const server = await createServer(container);

      // Kirim request DELETE tanpa header authorization
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-123/comments/comment-123/replies/reply-123",
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    // Test ketika threadId tidak ditemukan
    it("should response 404 if thread id did not available", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-zzz/comments/comment-yyy/replies/reply-xxx",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan!");
    });

    // Test ketika commentId tidak ditemukan di thread yang valid
    it("should response 404 if comment id did not available", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread terlebih dahulu
      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "Dummy thread title",
          body: "Dummy thread body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadResponse = JSON.parse(thread.payload);

      // Coba delete reply dari comment yang tidak ada
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/xxxx/replies/reply-xxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("komentar tidak ditemukan!");
    });

    // Test ketika replyId tidak ditemukan
    it("should response 404 if reply id did not available", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread, comment terlebih dahulu
      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "Dummy thread title",
          body: "Dummy thread body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "Dummy content of comment",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const commentResponse = JSON.parse(comment.payload);

      // Coba delete reply yang tidak ada
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies/reply-xxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("balasan tidak ditemukan!");
    });

    // Test ketika user bukan pemilik reply
    it("should response 403 if user is not the owner of reply", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat user kedua
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding2",
          password: "kosong123",
          fullname: "Dicoding Backend 2",
        },
      });

      const authentication2 = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding2",
          password: "kosong123",
        },
      });

      const responseAuth2 = JSON.parse(authentication2.payload);
      const accessToken2 = responseAuth2.data.accessToken;

      // User pertama buat thread, comment, dan reply
      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "Dummy thread title",
          body: "Dummy thread body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "Dummy content of comment",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const commentResponse = JSON.parse(comment.payload);

      const reply = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
        payload: {
          content: "Dummy content of reply",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const replyResponse = JSON.parse(reply.payload);

      // User kedua coba delete reply milik user pertama
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies/${replyResponse.data.addedReply.id}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "Gagal menghapus pesan reply, anda bukan pemilik reply ini!."
      );
    });

    // Test berhasil menghapus reply (soft delete)
    it("should response 200 and successfully delete reply", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread, comment, dan reply terlebih dahulu
      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "Dummy thread title",
          body: "Dummy thread body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "Dummy content of comment",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const commentResponse = JSON.parse(comment.payload);

      const reply = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
        payload: {
          content: "Dummy content of reply",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const replyResponse = JSON.parse(reply.payload);

      // Delete reply tersebut
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies/${replyResponse.data.addedReply.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      // Verifikasi response
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");

      // Verifikasi bahwa reply sudah di-soft delete (deleted_at tidak null)
      const deletedAt = await RepliesTableTestHelper.checkDeletedAtRepliesById(
        replyResponse.data.addedReply.id
      );
      expect(deletedAt).not.toBeNull();
    });
  });

  // (Bagian DELETE akan dikomentari jika kamu lanjutkan)
});
