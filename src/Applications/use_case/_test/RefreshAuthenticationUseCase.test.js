const AuthenticationRepository = require("../../../Domains/authentications/AuthenticationRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const RefreshAuthenticationUseCase = require("../RefreshAuthenticationUseCase");

describe("RefreshAuthenticationUseCase", () => {
  /**
   * Test ini memastikan use case melempar error jika payload tidak mengandung refresh token.
   * Validasi input sangat penting agar proses selanjutnya tidak error karena data kurang.
   */
  it("should throw error if use case payload not contain refresh token", async () => {
    // Arrange: buat payload kosong tanpa refreshToken
    const useCasePayload = {};
    // Instance use case tanpa dependency karena ini hanya validasi input
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

    // Action & Assert: panggil execute dan pastikan error yang tepat dilempar
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
    );
  });

  /**
   * Test ini memastikan jika refresh token yang diberikan bukan string,
   * maka use case harus melempar error validasi tipe data.
   */
  it("should throw error if refresh token not string", async () => {
    // Arrange: payload dengan refreshToken tipe number (bukan string)
    const useCasePayload = {
      refreshToken: 1,
    };
    // Instance use case tanpa dependency karena validasi input saja
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

    // Action & Assert: panggil execute dan pastikan error tipe data dilempar
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  /**
   * Test ini menguji orchestrasi lengkap untuk proses refresh token:
   * 1. Verifikasi refresh token valid
   * 2. Cek ketersediaan token pada repository (apakah token terdaftar)
   * 3. Dekode payload dari refresh token untuk mendapatkan data user
   * 4. Buat access token baru berdasarkan data user dari payload
   *
   * Tujuannya memastikan seluruh alur kerja dipanggil dengan benar dan hasil sesuai ekspektasi.
   */
  it("should orchestrating the refresh authentication action correctly", async () => {
    // Arrange: payload dengan refresh token valid bertipe string
    const useCasePayload = {
      refreshToken: "some_refresh_token",
    };

    // Mock instance repository dan token manager
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // Mock method repository dan token manager yang akan dipanggil use case
    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve()); // token tersedia
    mockAuthenticationTokenManager.verifyRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve()); // verifikasi berhasil
    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ username: "dicoding", id: "user-123" })
      ); // payload user
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve("some_new_access_token")); // access token baru

    // Buat instance use case dengan dependency mock
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Act: jalankan use case execute untuk refresh token
    const accessToken = await refreshAuthenticationUseCase.execute(
      useCasePayload
    );

    // Assert: pastikan setiap method dipanggil dengan argumen yang benar
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith(
      useCasePayload.refreshToken
    );
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(
      useCasePayload.refreshToken
    );
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
      useCasePayload.refreshToken
    );
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: "dicoding",
      id: "user-123",
    });

    // Pastikan hasil access token sesuai dengan mock yang sudah disiapkan
    expect(accessToken).toEqual("some_new_access_token");
  });
});
