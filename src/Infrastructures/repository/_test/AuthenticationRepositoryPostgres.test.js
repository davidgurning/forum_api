// Import class custom error InvariantError untuk validasi error bisnis (misal token tidak ditemukan)
const InvariantError = require("../../../Commons/exceptions/InvariantError");

// Import helper test yang berfungsi untuk manipulasi tabel authentications di database selama testing
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");

// Import pool koneksi Postgres agar bisa berinteraksi dengan database PostgreSQL
const pool = require("../../database/postgres/pool");

// Import class repository Authentication yang akan diuji (berinteraksi dengan database Postgres)
const AuthenticationRepositoryPostgres = require("../AuthenticationRepositoryPostgres");

// Deskripsi suite testing untuk modul AuthenticationRepositoryPostgres
describe("AuthenticationRepository postgres", () => {
  // Hook afterEach dijalankan setelah setiap test case
  // Membersihkan tabel authentications agar tidak ada data token yang tersisa dari test sebelumnya
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  // Hook afterAll dijalankan sekali setelah semua test selesai
  // Menutup koneksi database pool agar tidak ada resource leak
  afterAll(async () => {
    await pool.end();
  });

  // Suite test untuk fungsi addToken pada repository
  describe("addToken function", () => {
    // Test case: harus berhasil menambahkan token ke database
    it("should add token to database", async () => {
      // Arrange
      // Membuat instance repository dengan koneksi pool
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool
      );
      // Token dummy yang akan disimpan ke database
      const token = "token";

      // Action
      // Memanggil fungsi addToken untuk memasukkan token ke tabel authentications
      await authenticationRepository.addToken(token);

      // Assert
      // Mengambil token dari database menggunakan helper test untuk verifikasi
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      // Memastikan token yang disimpan ada di database sebanyak 1 record
      expect(tokens).toHaveLength(1);
      // Memastikan token yang disimpan sama dengan token yang dimasukkan
      expect(tokens[0].token).toBe(token);
    });
  });

  // Suite test untuk fungsi checkAvailabilityToken pada repository
  describe("checkAvailabilityToken function", () => {
    // Test case: harus melempar error InvariantError jika token tidak ditemukan di database
    it("should throw InvariantError if token not available", async () => {
      // Arrange
      // Membuat instance repository
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool
      );
      // Token dummy yang tidak disimpan di database
      const token = "token";

      // Action & Assert
      // Mengecek apakah pemanggilan fungsi checkAvailabilityToken melempar InvariantError
      await expect(
        authenticationRepository.checkAvailabilityToken(token)
      ).rejects.toThrow(InvariantError);
    });

    // Test case: tidak boleh melempar error jika token tersedia di database
    it("should not throw InvariantError if token available", async () => {
      // Arrange
      // Membuat instance repository
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool
      );
      const token = "token";
      // Menambahkan token ke database dulu supaya tersedia untuk dicek
      await AuthenticationsTableTestHelper.addToken(token);

      // Action & Assert
      // Mengecek bahwa fungsi checkAvailabilityToken tidak melempar error untuk token yang ada
      await expect(
        authenticationRepository.checkAvailabilityToken(token)
      ).resolves.not.toThrow(InvariantError);
    });
  });

  // Suite test untuk fungsi deleteToken pada repository
  describe("deleteToken", () => {
    // Test case: harus berhasil menghapus token dari database
    it("should delete token from database", async () => {
      // Arrange
      // Membuat instance repository
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool
      );
      const token = "token";
      // Menambahkan token ke database terlebih dahulu supaya bisa dihapus
      await AuthenticationsTableTestHelper.addToken(token);

      // Action
      // Memanggil fungsi deleteToken untuk menghapus token yang sudah disimpan
      await authenticationRepository.deleteToken(token);

      // Assert
      // Mengecek token di database setelah penghapusan, harus kosong (0)
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});
