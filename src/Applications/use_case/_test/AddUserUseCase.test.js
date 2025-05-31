// Mengimpor entity RegisterUser yang merepresentasikan data user baru yang akan didaftarkan.
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
// Mengimpor entity RegisteredUser yang merepresentasikan user yang sudah berhasil didaftarkan dan memiliki ID.
const RegisteredUser = require("../../../Domains/users/entities/RegisteredUser");
// Mengimpor interface UserRepository yang akan digunakan untuk interaksi data user (misal ke DB).
const UserRepository = require("../../../Domains/users/UserRepository");
// Mengimpor interface PasswordHash yang digunakan untuk melakukan hashing password.
const PasswordHash = require("../../security/PasswordHash");
// Mengimpor use case AddUserUseCase yang merupakan logika bisnis utama untuk menambahkan user baru.
const AddUserUseCase = require("../AddUserUseCase");

describe("AddUserUseCase", () => {
  /**
   * Test ini memverifikasi apakah AddUserUseCase mampu mengorkestrasi
   * seluruh langkah pendaftaran user dengan benar dan berurutan.
   *
   * Langkah yang diharapkan adalah:
   * 1. Memeriksa ketersediaan username (apakah sudah digunakan).
   * 2. Melakukan hashing password.
   * 3. Menyimpan user baru ke repository.
   * 4. Mengembalikan objek RegisteredUser sebagai hasil pendaftaran.
   */
  it("should orchestrating the add user action correctly", async () => {
    // Arrange: Menyiapkan data input yang akan dipakai pada use case.
    const useCasePayload = {
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    };

    // Membuat instance mock dari RegisteredUser sebagai hasil yang diharapkan dari repository.
    const mockRegisteredUser = new RegisteredUser({
      id: "user-123", // ID user yang di-generate (biasanya oleh DB)
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    // Membuat mock objek dependency yang digunakan oleh AddUserUseCase:
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    // Mocking method verifyAvailableUsername agar tidak benar-benar cek DB,
    // cukup mengembalikan Promise resolve kosong (artinya username tersedia).
    mockUserRepository.verifyAvailableUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Mocking method hash untuk mengembalikan string hash palsu 'encrypted_password'.
    mockPasswordHash.hash = jest
      .fn()
      .mockImplementation(() => Promise.resolve("encrypted_password"));

    // Mocking method addUser untuk mengembalikan mockRegisteredUser sebagai hasil simpan user.
    mockUserRepository.addUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    // Membuat instance AddUserUseCase dan memasukkan dependency yang sudah dimock.
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action: Memanggil metode execute dengan payload yang sudah disiapkan.
    // execute adalah fungsi utama untuk menjalankan use case pendaftaran user.
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    // Assert: Memastikan hasil yang didapat sesuai dengan ekspektasi.
    // Membandingkan objek registeredUser dengan instance RegisteredUser yang diharapkan.
    expect(registeredUser).toStrictEqual(
      new RegisteredUser({
        id: "user-123",
        username: useCasePayload.username,
        fullname: useCasePayload.fullname,
      })
    );

    // Memastikan bahwa method verifyAvailableUsername dipanggil sekali dengan username yang benar.
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(
      useCasePayload.username
    );

    // Memastikan bahwa method hash dipanggil sekali dengan password asli (plain password).
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);

    // Memastikan method addUser dipanggil dengan objek RegisterUser yang sudah berisi data username,
    // password yang sudah di-hash ('encrypted_password'), dan fullname.
    expect(mockUserRepository.addUser).toBeCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: "encrypted_password",
        fullname: useCasePayload.fullname,
      })
    );
  });
});
