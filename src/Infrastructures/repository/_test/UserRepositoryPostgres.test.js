// Import helper untuk manipulasi tabel users pada database selama testing
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
// Import error khusus untuk validasi invariant yang dilanggar (misal data sudah ada)
const InvariantError = require("../../../Commons/exceptions/InvariantError");
// Import entity RegisterUser yang merepresentasikan data user untuk registrasi
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
// Import entity RegisteredUser yang merepresentasikan user yang sudah terdaftar (hasil registrasi)
const RegisteredUser = require("../../../Domains/users/entities/RegisteredUser");
// Import koneksi pool ke database PostgreSQL untuk query
const pool = require("../../database/postgres/pool");
// Import class repository UserRepositoryPostgres yang akan diuji
const UserRepositoryPostgres = require("../UserRepositoryPostgres");

// Describe block utama untuk kumpulan test terkait UserRepositoryPostgres
describe("UserRepositoryPostgres", () => {
  // Setelah setiap test selesai, panggil fungsi ini untuk membersihkan isi tabel users
  // agar data test tidak menumpuk dan mengganggu test berikutnya
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  // Setelah semua test selesai, tutup koneksi pool database agar tidak terjadi memory leak
  afterAll(async () => {
    await pool.end();
  });

  // Test suite untuk fungsi verifyAvailableUsername
  describe("verifyAvailableUsername function", () => {
    // Test ketika username sudah ada di database, harus melempar error InvariantError
    it("should throw InvariantError when username not available", async () => {
      // Arrange: Masukkan user baru dengan username 'dicoding' ke database test
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      // Buat instance UserRepositoryPostgres dengan pool dan dummy idGenerator kosong
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert: Panggil verifyAvailableUsername dengan username yang sudah ada,
      // harus melempar InvariantError karena username tidak tersedia (duplicate)
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding")
      ).rejects.toThrowError(InvariantError);
    });

    // Test ketika username belum ada, maka tidak boleh melempar error
    it("should not throw InvariantError when username available", async () => {
      // Arrange: buat instance UserRepositoryPostgres
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert: verifyAvailableUsername dengan username baru harus sukses (tidak throw error)
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding")
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  // Test suite untuk fungsi addUser yang menambahkan user baru ke database
  describe("addUser function", () => {
    // Test untuk memastikan user baru disimpan ke database dengan benar
    it("should persist register user and return registered user correctly", async () => {
      // Arrange: buat objek RegisterUser sebagai input data user baru
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
      // Stub atau fake idGenerator yang selalu mengembalikan string '123'
      // ini untuk menghindari id random agar predictable di test
      const fakeIdGenerator = () => "123";
      // Buat instance UserRepositoryPostgres dengan pool dan fakeIdGenerator
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action: panggil addUser untuk menambahkan user ke database
      await userRepositoryPostgres.addUser(registerUser);

      // Assert: cek di database user dengan id 'user-123' ada (hasil dari fakeIdGenerator)
      const users = await UsersTableTestHelper.findUsersById("user-123");
      expect(users).toHaveLength(1); // harus ada 1 user yang ditemukan
    });

    // Test untuk memastikan fungsi addUser mengembalikan objek RegisteredUser dengan data benar
    it("should return registered user correctly", async () => {
      // Arrange: buat objek RegisterUser untuk input data user baru
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
      // Gunakan fakeIdGenerator yang mengembalikan '123' agar id predictable
      const fakeIdGenerator = () => "123";
      // Buat instance UserRepositoryPostgres
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action: panggil addUser untuk menambahkan user dan simpan hasil return
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert: hasil return harus sama persis dengan objek RegisteredUser yang diharapkan
      // dengan id yang mengandung 'user-123' sesuai fakeIdGenerator
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: "user-123",
          username: "dicoding",
          fullname: "Dicoding Indonesia",
        })
      );
    });
  });

  // Test suite untuk fungsi getPasswordByUsername yang mengambil password user dari username
  describe("getPasswordByUsername", () => {
    // Test untuk memastikan error dilempar jika user tidak ditemukan di database
    it("should throw InvariantError when user not found", () => {
      // Arrange: buat instance UserRepositoryPostgres
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert: panggil getPasswordByUsername dengan username yg tidak ada
      // harus melempar InvariantError
      return expect(
        userRepositoryPostgres.getPasswordByUsername("dicoding")
      ).rejects.toThrowError(InvariantError);
    });

    // Test untuk memastikan password dikembalikan dengan benar jika user ditemukan
    it("should return username password when user is found", async () => {
      // Arrange: buat instance UserRepositoryPostgres
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      // Tambahkan user ke database test dengan username dan password
      await UsersTableTestHelper.addUser({
        username: "dicoding",
        password: "secret_password",
      });

      // Action: panggil getPasswordByUsername untuk username yang sudah ada
      const password = await userRepositoryPostgres.getPasswordByUsername(
        "dicoding"
      );

      // Assert: password yang didapat harus sama dengan yang disimpan
      expect(password).toBe("secret_password");
    });
  });

  // Test suite untuk fungsi getIdByUsername yang mengambil id user berdasarkan username
  describe("getIdByUsername", () => {
    // Test untuk memastikan error dilempar jika user tidak ditemukan
    it("should throw InvariantError when user not found", async () => {
      // Arrange: buat instance UserRepositoryPostgres
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert: panggil getIdByUsername dengan username yang tidak ada
      // harus melempar InvariantError
      await expect(
        userRepositoryPostgres.getIdByUsername("dicoding")
      ).rejects.toThrowError(InvariantError);
    });

    // Test untuk memastikan id user dikembalikan dengan benar saat user ditemukan
    it("should return user id correctly", async () => {
      // Arrange: masukkan user dengan id dan username tertentu ke database test
      await UsersTableTestHelper.addUser({
        id: "user-321",
        username: "dicoding",
      });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action: panggil getIdByUsername untuk username yang ada
      const userId = await userRepositoryPostgres.getIdByUsername("dicoding");

      // Assert: id yang dikembalikan harus sama dengan id user yang disimpan
      expect(userId).toEqual("user-321");
    });
  });
});
