// Import modul pool koneksi database PostgreSQL
const pool = require("../../database/postgres/pool");

// Import helper untuk mengelola tabel Threads selama testing (untuk reset data dll)
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
// Import helper untuk mengelola tabel Users selama testing
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
// Import helper untuk mengelola tabel Comments selama testing
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

// Import container dependency injection yang berisi service dan repository yang diperlukan
const container = require("../../container");

// Import fungsi pembuat server Hapi (createServer) dengan konfigurasi container
const createServer = require("../createServer");

// Mulai blok pengujian untuk endpoint komentar
describe("comments endpoint", () => {
  // Setelah semua test selesai, tutup koneksi pool database agar tidak terjadi memory leak
  afterAll(async () => {
    await pool.end();
  });

  // Setelah setiap test selesai, bersihkan isi tabel komentar, thread, dan user agar test berikutnya bersih (isolasi test)
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  // Fungsi helper async untuk mendapatkan access token dengan cara registrasi dan login user dummy
  const getAccessToken = async (server) => {
    // Data login user dummy
    const loginPayload = {
      username: "dicoding",
      password: "kosong123",
    };

    // Simulasi request POST /users untuk registrasi user baru
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: loginPayload.username,
        password: loginPayload.password,
        fullname: "Dicoding Backend",
      },
    });

    // Simulasi request POST /authentications untuk login user dan mendapatkan token
    const authentication = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: loginPayload,
    });

    // Parsing response JSON yang berisi accessToken
    const responseAuth = JSON.parse(authentication.payload);
    const accessToken = responseAuth.data.accessToken;

    // Kembalikan access token yang nanti akan dipakai untuk authorize request
    return accessToken;
  };

  // Blok pengujian khusus untuk endpoint POST menambahkan komentar pada thread tertentu
  describe("when POST threads/{threadId}/comments", () => {
    // Test jika request tidak menyertakan access token harusnya respon 401 Unauthorized
    it("should response 401 if payload not access token", async () => {
      const server = await createServer(container); // buat server baru untuk test
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: {}, // tanpa isi payload dan tanpa token
      });

      const responseJson = JSON.parse(response.payload);

      // Verifikasi status dan pesan error yang diterima sesuai ekspektasi
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    // Test jika payload kosong (tidak ada property yang dibutuhkan) harusnya respon 400 Bad Request
    it("should response 400 if payload not contain needed property", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server); // dapatkan token untuk authorized request

      // Buat dulu thread baru supaya bisa menambahkan komentar ke thread itu
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

      // Parsing response thread
      const threadResponse = JSON.parse(thread.payload);

      // Coba request POST komentar tanpa isi payload content
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {}, // payload kosong, tidak ada properti content
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      // Harus dapat respon 400 dengan pesan error properti tidak lengkap
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "gagal membuat komentar baru, beberapa properti yang dibutuhkan tidak ada"
      );
    });

    // Test jika tipe data payload tidak sesuai (misal content bukan string) harus respon 400
    it("should response 400 if payload not meet data type specification", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread dulu
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

      // Kirim komentar dengan content bertipe number, harusnya gagal validasi tipe data
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 123, // tipe data salah (number seharusnya string)
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      // Verifikasi status dan pesan error tipe data tidak sesuai
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "gagal membuat komentar baru, tipe data tidak sesuai"
      );
    });

    // Test jika thread id tidak valid (tidak ada thread dengan id tersebut) harus respon 404 Not Found
    it("should response 404 if thread id not valid", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Coba post komentar ke thread yang id-nya invalid (thread-xxx)
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-xxx/comments",
        payload: {
          content: "Dummy content of comment",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      // Harus dapat respon 404 dengan pesan thread tidak ditemukan
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan!");
    });

    // Test sukses menambahkan komentar, harus respon 201 Created dan kembalikan data komentar yang dibuat
    it("should response 201 and return addedComment", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread dulu
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

      // Tambahkan komentar dengan content string valid
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "Dummy content of comment",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      // Verifikasi status 201 dan response komentar yang berhasil dibuat
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment.content).toEqual(
        "Dummy content of comment"
      );
    });
  });

  // Blok pengujian khusus untuk endpoint DELETE komentar di thread tertentu
  describe("when DELETE /threads/{threadId}/comments/{id}", () => {
    // Test jika thread tidak ditemukan, harus respon 404
    it("should response 404 if thread not found", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // DELETE komentar pada thread yang tidak ada
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-xxx/comments/comment-123",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      // Harus dapat response 404 dengan pesan thread tidak ditemukan
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan!");
    });

    // Test jika komentar tidak ditemukan, harus respon 404
    it("should response 404 if comment not found", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread dulu agar bisa melakukan delete komentar pada thread tersebut
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

      // Coba hapus komentar dengan id tidak valid
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/comment-xxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      // Harus dapat response 404 dengan pesan komentar tidak ditemukan
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("komentar tidak ditemukan!");
    });

    // Test jika user lain mencoba menghapus komentar yang bukan miliknya, harus respon 403 Forbidden
    it("should response 403 if another user delete the comment", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread dulu
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

      // Tambahkan komentar sebagai user pertama (dicoding)
      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "Comment made by dicoding",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentResponse = JSON.parse(comment.payload);

      // Simulasi user lain (sitoruszs) yang berbeda dengan pembuat komentar
      const loginPayload_2 = {
        username: "sitoruszs",
        password: "kosong123",
      };

      // Registrasi user lain
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "sitoruszs",
          password: "kosong123",
          fullname: "Another Account",
        },
      });

      // Login user lain untuk mendapatkan access token
      const authentication_2 = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: loginPayload_2,
      });

      const responseAuth_2 = JSON.parse(authentication_2.payload);

      // User lain mencoba menghapus komentar milik user pertama
      const replyResponse = await server.inject({
        method: "DELETE",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}`,
        headers: {
          Authorization: `Bearer ${responseAuth_2.data.accessToken}`,
        },
      });

      const responseJson = JSON.parse(replyResponse.payload);

      // Harus dapat response 403 dengan pesan gagal hapus karena bukan pemilik komentar
      expect(replyResponse.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "Gagal menghapus komentar, anda bukan pemilik komentar ini!"
      );
    });

    // Test sukses menghapus komentar oleh pemilik komentar, harus respon 200
    it("should response 200 and delete comment success", async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Buat thread dulu
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

      // Tambahkan komentar sebagai user yang sama
      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "Comment to be deleted",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentResponse = JSON.parse(comment.payload);

      // Lakukan delete komentar
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      // Verifikasi respon 200 dan status success
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
