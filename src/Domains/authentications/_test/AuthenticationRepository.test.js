const AuthenticationRepository = require("../AuthenticationRepository");
// Mengimpor kelas AuthenticationRepository yang biasanya adalah abstract class atau interface
// yang mendefinisikan metode-metode terkait autentikasi token tapi belum diimplementasikan.

describe("AuthenticationRepository interface", () => {
  // Mendefinisikan sebuah suite pengujian (test suite) dengan nama 'AuthenticationRepository interface'

  it("should throw error when invoke unimplemented method", async () => {
    // Mendefinisikan sebuah test case yang menjelaskan bahwa
    // memanggil metode yang belum diimplementasikan harus melempar error.

    // Arrange
    const authenticationRepository = new AuthenticationRepository();
    // Membuat instance baru dari AuthenticationRepository.
    // Karena ini adalah kelas abstrak atau interface, metode-metodenya biasanya belum diimplementasikan
    // dan harus melempar error jika dipanggil langsung.

    // Action & Assert
    await expect(authenticationRepository.addToken("")).rejects.toThrowError(
      "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    // Memanggil metode addToken dengan parameter kosong string ''.
    // Karena addToken belum diimplementasikan, kita harapkan promise-nya reject (error).
    // Kemudian diuji bahwa error yang dilempar berisi pesan 'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'.

    await expect(
      authenticationRepository.checkAvailabilityToken("")
    ).rejects.toThrowError("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    // Sama seperti di atas, tapi untuk metode checkAvailabilityToken.
    // Memastikan error yang dilempar sama-sama pesan 'METHOD_NOT_IMPLEMENTED'.

    await expect(authenticationRepository.deleteToken("")).rejects.toThrowError(
      "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    // Sama juga untuk metode deleteToken.
    // Ini menguji konsistensi bahwa semua metode yang belum diimplementasikan melempar error yang sama.
  });
});
