// Import helper untuk membersihkan dan mengelola data tabel 'threads' selama pengujian
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
// Import helper untuk membersihkan dan mengelola data tabel 'users' selama pengujian
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
// Import koneksi pool Postgres yang akan digunakan untuk query database selama pengujian
const pool = require("../../database/postgres/pool");
// Import container dependency injection yang berisi seluruh service yang diperlukan server
const container = require("../../container");
// Import fungsi untuk membuat instance server Hapi.js
const createServer = require("../createServer");

// Grouping test suite untuk endpoint 'threads'
describe("threads endpoint", () => {
  // Setelah seluruh test selesai dijalankan, koneksi pool database ditutup agar tidak menggantung
  afterAll(async () => {
    await pool.end();
  });

  // Setelah setiap test dijalankan, bersihkan data pada tabel threads dan users agar test berikutnya berjalan di kondisi bersih (isolasi test)
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  // Fungsi async helper untuk mendapatkan access token valid dengan cara:
  // - Membuat user baru
  // - Login dengan user tersebut
  // - Mengembalikan access token yang diterima
  async function getAccessToken() {
    // Payload login dengan username dan password yang sudah ditentukan
    const loginPayload = {
      username: "dicoding",
      password: "kosong123",
    };

    // Membuat instance server agar dapat melakukan request internal
    const server = await createServer(container);

    // Membuat user baru dengan method POST ke endpoint /users dengan payload user yang diinginkan
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding",
        password: "kosong123",
        fullname: "Dicoding Indonesia",
      },
    });

    // Melakukan login dengan user yang sudah dibuat untuk mendapatkan token autentikasi
    const authentication = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: loginPayload,
    });

    // Parsing response payload JSON agar bisa diakses isinya
    const responseAuth = JSON.parse(authentication.payload);
    // Mengambil access token dari response data
    const accessToken = responseAuth.data.accessToken;

    // Mengembalikan access token untuk digunakan di test berikutnya
    return accessToken;
  }

  // Grouping test untuk method POST pada endpoint /threads
  describe("when POST /threads", () => {
    // Test case: Jika authorization header tidak ada, maka server harus merespon 401 Unauthorized
    it("should response 401 if authorization in header is missing", async () => {
      const server = await createServer(container);

      // Melakukan request POST ke /threads tanpa header Authorization
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {},
      });

      // Parsing response ke JSON
      const responseJson = JSON.parse(response.payload);

      // Mengecek apakah status kode yang diterima 401 Unauthorized
      expect(response.statusCode).toEqual(401);
      // Mengecek apakah error message yang diterima sesuai
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    // Test case: Jika payload tidak memiliki properti yang diperlukan, server harus merespon 400 Bad Request
    it("should response 400 if payload not contain needed property", async () => {
      const server = await createServer(container);

      // Mendapatkan access token user yang valid terlebih dahulu
      const accessToken = await getAccessToken();

      // Melakukan request POST ke /threads dengan payload kosong dan Authorization header yang valid
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {}, // payload kosong tanpa properti 'title' dan 'body'
        headers: {
          Authorization: `Bearer ${accessToken}`, // sertakan token autentikasi
        },
      });

      // Parsing response ke JSON
      const responseJson = JSON.parse(response.payload);

      // Pastikan status respons 400 karena data tidak lengkap
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      // Pesan error sesuai bahwa properti yang dibutuhkan tidak ada
      expect(responseJson.message).toEqual(
        "gagal membuat thread baru, beberapa properti yang dibutuhkan tidak ada"
      );
    });

    // Test case: Jika tipe data pada payload tidak sesuai spesifikasi, server harus merespon 400 Bad Request
    it("should response 400 if payload not meet data type specification", async () => {
      const server = await createServer(container);

      // Mendapatkan access token yang valid
      const accessToken = await getAccessToken();

      // Melakukan request POST ke /threads dengan tipe data body yang salah (harus string tapi diberi number)
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "Dummy thread title", // tipe data string sesuai
          body: 123455446, // tipe data tidak sesuai (seharusnya string)
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Parsing response ke JSON
      const responseJson = JSON.parse(response.payload);

      // Pastikan respons 400 karena tipe data tidak sesuai
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      // Pesan error sesuai dengan kegagalan validasi tipe data
      expect(responseJson.message).toEqual(
        "gagal membuat thread baru, tipe data tidak sesuai"
      );
    });

    // Test case: Jika payload valid dan header Authorization ada, server harus berhasil membuat thread dan merespon 201 Created
    it("should response 201 and create new thread", async () => {
      const server = await createServer(container);

      // Mendapatkan access token user yang valid
      const accessToken = await getAccessToken();

      // Melakukan request POST ke /threads dengan payload yang valid
      const response = await server.inject({
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

      // Parsing response ke JSON
      const responseJson = JSON.parse(response.payload);

      // Pastikan respons status 201 Created
      expect(response.statusCode).toEqual(201);
      // Status response harus success
      expect(responseJson.status).toEqual("success");
      // Pastikan judul thread yang dikembalikan sama dengan yang dikirim
      expect(responseJson.data.addedThread.title).toEqual("Dummy thread title");
    });
  });

  // Grouping test untuk method GET pada endpoint /threads
  describe("when GET /threads", () => {
    // Test case: Jika thread dengan id yang diminta tidak ada, server harus merespon 404 Not Found
    it("should response 404 when thread not valid", async () => {
      const server = await createServer(container);

      // Mendapatkan access token yang valid
      const accessToken = await getAccessToken();

      // Melakukan request GET ke /threads dengan id thread yang tidak valid (xxx)
      const response = await server.inject({
        method: "GET",
        url: "/threads/xxx",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Parsing response ke JSON
      const responseJson = JSON.parse(response.payload);

      // Pastikan respons status 404 Not Found
      expect(response.statusCode).toEqual(404);
      // Status response harus fail
      expect(responseJson.status).toEqual("fail");
      // Pesan error sesuai dengan thread yang tidak ditemukan
      expect(responseJson.message).toEqual("thread tidak ditemukan!");
    });

    // Test case: Jika thread ada, server harus merespon 200 dan mengembalikan detail thread beserta komentar dan username
    it("should response 200 and return detail thread", async () => {
      const server = await createServer(container);

      // Mendapatkan access token yang valid
      const accessToken = await getAccessToken();

      // Membuat thread baru terlebih dahulu agar ada data yang bisa diambil
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

      // Parsing hasil pembuatan thread untuk mendapatkan ID thread
      const threadResponse = JSON.parse(thread.payload);

      // Melakukan request GET ke /threads/{id} dengan id thread yang baru dibuat
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadResponse.data.addedThread.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Parsing response ke JSON
      const responseJson = JSON.parse(response.payload);

      // Pastikan status respons 200 OK
      expect(response.statusCode).toEqual(200);
      // Status harus success
      expect(responseJson.status).toEqual("success");
      // Pastikan id thread yang diterima sama dengan id yang dibuat
      expect(responseJson.data.thread.id).toEqual(
        threadResponse.data.addedThread.id
      );
      // Pastikan title dan body thread sesuai
      expect(responseJson.data.thread.title).toEqual("Dummy thread title");
      expect(responseJson.data.thread.body).toEqual("Dummy thread body");
      // Pastikan username pembuat thread sesuai dengan user login (dicoding)
      expect(responseJson.data.thread.username).toEqual("dicoding");
      // Pastikan comments berupa array
      expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
      // Jika comments ada, lakukan pengecekan juga untuk replies tiap komentar apakah berupa array
      if (Array.isArray(responseJson.data.thread.comments)) {
        responseJson.data.thread.comments.forEach((comments) => {
          if (comments.replies) {
            expect(
              Array.isArray(responseJson.data.thread.comments.replies)
            ).toBe(true);
          }
        });
      }
    });
  });
});
