const UserRepository = require("../../../Domains/users/UserRepository");
const AuthenticationRepository = require("../../../Domains/authentications/AuthenticationRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const PasswordHash = require("../../security/PasswordHash");
const LoginUserUseCase = require("../LoginUserUseCase");
const NewAuth = require("../../../Domains/authentications/entities/NewAuth");

describe("GetAuthenticationUseCase", () => {
  // Test utama yang memastikan alur login user berjalan dengan benar
  it("should orchestrating the get authentication action correctly", async () => {
    // Arrange: siapkan input payload berupa username dan password yang dimasukkan user saat login
    const useCasePayload = {
      username: "dicoding",
      password: "secret",
    };

    // Siapkan objek NewAuth yang mewakili hasil token yang dihasilkan (accessToken & refreshToken)
    const mockedAuthentication = new NewAuth({
      accessToken: "access_token",
      refreshToken: "refresh_token",
    });

    // Buat mock instance dari semua repository dan service yang dibutuhkan oleh use case
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    // Mocking method-method yang akan dipanggil pada repositori dan service:
    // 1. Mendapatkan password terenkripsi berdasarkan username dari database
    mockUserRepository.getPasswordByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve("encrypted_password"));

    // 2. Membandingkan password plain text dengan password terenkripsi
    mockPasswordHash.comparePassword = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // 3. Membuat access token berdasarkan payload user (username dan id)
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(mockedAuthentication.accessToken)
      );

    // 4. Membuat refresh token dengan payload yang sama
    mockAuthenticationTokenManager.createRefreshToken = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(mockedAuthentication.refreshToken)
      );

    // 5. Mendapatkan user ID berdasarkan username (untuk payload token)
    mockUserRepository.getIdByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve("user-123"));

    // 6. Menyimpan refresh token ke repository penyimpanan token (database atau cache)
    mockAuthenticationRepository.addToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Buat instance use case dengan menyuntikkan semua dependency mock di atas
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action: jalankan method execute use case dengan payload username dan password
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert: pastikan hasil yang dikembalikan adalah objek NewAuth dengan access dan refresh token yang sesuai
    expect(actualAuthentication).toEqual(
      new NewAuth({
        accessToken: "access_token",
        refreshToken: "refresh_token",
      })
    );

    // Pastikan method getPasswordByUsername dipanggil dengan username yang benar
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith("dicoding");

    // Pastikan method comparePassword dipanggil dengan password plain dan password terenkripsi dari database
    expect(mockPasswordHash.comparePassword).toBeCalledWith(
      "secret",
      "encrypted_password"
    );

    // Pastikan method getIdByUsername dipanggil dengan username yang benar
    expect(mockUserRepository.getIdByUsername).toBeCalledWith("dicoding");

    // Pastikan method createAccessToken dipanggil dengan payload yang berisi username dan user id
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: "dicoding",
      id: "user-123",
    });

    // Pastikan method createRefreshToken juga dipanggil dengan payload yang sama
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
      username: "dicoding",
      id: "user-123",
    });

    // Pastikan token refresh yang dihasilkan disimpan ke repository authentication
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(
      mockedAuthentication.refreshToken
    );
  });
});
