// Import koneksi pool PostgreSQL untuk manajemen koneksi database
const pool = require("../../database/postgres/pool");
// Import helper khusus untuk mengelola tabel users pada saat testing, seperti membersihkan tabel atau menambah data dummy
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
// Import container dependency injection yang berisi semua dependensi yang dibutuhkan oleh server
const container = require("../../container");
// Import fungsi untuk membuat instance server Hapi yang sudah terkonfigurasi dengan container dan route
const createServer = require("../createServer");

// Mendefinisikan test suite untuk endpoint '/users'
describe("/users endpoint", () => {
  // Setelah semua test selesai dijalankan, pastikan koneksi pool database ditutup agar proses Node.js dapat selesai dengan benar
  afterAll(async () => {
    await pool.end();
  });

  // Setelah setiap test selesai, bersihkan isi tabel users agar setiap test berjalan dalam kondisi database yang bersih dan independen
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  // Nested describe khusus untuk pengujian method POST pada endpoint /users
  describe("when POST /users", () => {
    // Test case: ketika request valid, server harus membuat user baru dan mengembalikan response 201 dengan data user yang dibuat
    it("should response 201 and persisted user", async () => {
      // Arrange: menyiapkan payload request yang valid untuk membuat user baru
      const requestPayload = {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };
      // Membuat instance server yang siap untuk diuji (menggunakan container sebagai dependency injection)
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action: melakukan request POST /users dengan payload yang sudah disiapkan
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert: cek apakah status response adalah 201 (Created), status dalam payload bernilai 'success', dan data user yang baru dibuat ada
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedUser).toBeDefined();
    });

    // Test case: jika payload tidak mengandung properti yang dibutuhkan, server harus mengembalikan status 400 dengan pesan error
    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange: payload tanpa username (properti wajib)
      const requestPayload = {
        fullname: "Dicoding Indonesia",
        password: "secret",
      };
      // Buat server instance
      const server = await createServer(container);

      // Action: request POST /users dengan payload yang kurang properti
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert: cek apakah response status 400 (Bad Request) dengan pesan kesalahan yang tepat
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
      );
    });

    // Test case: jika tipe data properti tidak sesuai spesifikasi (misal fullname bukan string), server harus menolak dengan status 400
    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange: fullname diisi array, seharusnya string
      const requestPayload = {
        username: "dicoding",
        password: "secret",
        fullname: ["Dicoding Indonesia"],
      };
      const server = await createServer(container);

      // Action: kirim request POST /users dengan payload salah tipe data
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert: response harus 400 dengan pesan error yang sesuai
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat user baru karena tipe data tidak sesuai"
      );
    });

    // Test case: jika username melebihi batas maksimal 50 karakter, server harus menolak request dengan status 400
    it("should response 400 when username more than 50 character", async () => {
      // Arrange: username sangat panjang (lebih dari 50 karakter)
      const requestPayload = {
        username: "dicodingindonesiadicodingindonesiadicodingindonesiadicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };
      const server = await createServer(container);

      // Action: request POST dengan username terlalu panjang
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert: harus mendapatkan status 400 dengan pesan error validasi karakter username
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat user baru karena karakter username melebihi batas limit"
      );
    });

    // Test case: jika username mengandung karakter yang tidak diizinkan (misal spasi), server harus tolak dengan status 400
    it("should response 400 when username contain restricted character", async () => {
      // Arrange: username dengan spasi yang tidak diperbolehkan
      const requestPayload = {
        username: "dicoding indonesia",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };
      const server = await createServer(container);

      // Action: kirim request POST /users dengan username tidak valid
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert: harus mendapat 400 dan pesan error username mengandung karakter terlarang
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat user baru karena username mengandung karakter terlarang"
      );
    });

    // Test case: jika username sudah dipakai oleh user lain, server harus menolak request dengan status 400
    it("should response 400 when username unavailable", async () => {
      // Arrange: terlebih dahulu masukkan user dengan username 'dicoding' ke database agar tidak tersedia
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      const requestPayload = {
        username: "dicoding", // username yang sudah ada
        fullname: "Dicoding Indonesia",
        password: "super_secret",
      };
      const server = await createServer(container);

      // Action: coba buat user baru dengan username yang sudah dipakai
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert: response harus 400 dengan pesan bahwa username tidak tersedia
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("username tidak tersedia");
    });
  });
});
