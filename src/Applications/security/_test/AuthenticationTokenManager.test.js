// Mengimpor modul AuthenticationTokenManager dari file relatif '../AuthenticationTokenManager'
const AuthenticationTokenManager = require("../AuthenticationTokenManager");

// Menjelaskan suite pengujian menggunakan Jest untuk interface AuthenticationTokenManager
describe("AuthenticationTokenManager interface", () => {
  // Unit test ini menguji apakah setiap metode yang belum diimplementasikan akan melempar error yang sesuai
  it("should throw error when invoke unimplemented method", async () => {
    // Arrange: Membuat instance dari AuthenticationTokenManager
    // Ini seharusnya merupakan kelas abstrak/interface sehingga belum mengimplementasikan metode apapun
    const tokenManager = new AuthenticationTokenManager();

    // Action & Assert: Menguji bahwa setiap metode yang dipanggil akan melempar error
    // karena metode tersebut belum diimplementasikan dalam class turunannya

    // Menguji createAccessToken, seharusnya melempar error karena belum diimplementasi
    await expect(tokenManager.createAccessToken("")).rejects.toThrowError(
      "AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED"
    );

    // Menguji createRefreshToken, seharusnya juga melempar error
    await expect(tokenManager.createRefreshToken("")).rejects.toThrowError(
      "AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED"
    );

    // Menguji verifyRefreshToken, juga harus melempar error
    await expect(tokenManager.verifyRefreshToken("")).rejects.toThrowError(
      "AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED"
    );

    // Menguji decodePayload, seharusnya melempar error juga
    await expect(tokenManager.decodePayload("")).rejects.toThrowError(
      "AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED"
    );
  });
});
