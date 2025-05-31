const UserRepository = require("../UserRepository");

// Deskripsi kelompok pengujian (test suite) untuk interface UserRepository
describe("UserRepository interface", () => {
  // Test case untuk memastikan bahwa setiap method abstract pada UserRepository
  // akan melempar error jika dipanggil secara langsung tanpa implementasi nyata.
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange: Membuat instance dari kelas UserRepository.
    // Karena UserRepository ini merupakan interface (atau kelas abstrak),
    // method-methodnya belum diimplementasikan, hanya melempar error.
    const userRepository = new UserRepository();

    // Action and Assert: Memastikan bahwa pemanggilan setiap method async dari userRepository
    // melemparkan error dengan pesan 'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'.
    // Gunakan .rejects.toThrowError untuk mengetes error yang dilempar oleh promise (async function).

    // Memanggil method addUser dengan objek kosong, harus melempar error method belum diimplementasi
    await expect(userRepository.addUser({})).rejects.toThrowError(
      "USER_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    // Memanggil method verifyAvailableUsername dengan string kosong, harus melempar error
    await expect(
      userRepository.verifyAvailableUsername("")
    ).rejects.toThrowError("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    // Memanggil method getPasswordByUsername dengan string kosong, harus melempar error
    await expect(userRepository.getPasswordByUsername("")).rejects.toThrowError(
      "USER_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    // Memanggil method getIdByUsername dengan string kosong, harus melempar error
    await expect(userRepository.getIdByUsername("")).rejects.toThrowError(
      "USER_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
