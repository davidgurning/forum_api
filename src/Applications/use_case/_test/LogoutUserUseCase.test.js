const AuthenticationRepository = require("../../../Domains/authentications/AuthenticationRepository");
const LogoutUserUseCase = require("../LogoutUserUseCase");

describe("LogoutUserUseCase", () => {
  /**
   * Test ini memastikan bahwa jika payload yang diberikan ke use case tidak mengandung
   * refresh token, maka use case harus melempar error dengan pesan yang sesuai.
   * Ini adalah validasi awal untuk memastikan input sudah lengkap.
   */
  it("should throw error if use case payload not contain refresh token", async () => {
    // Arrange: buat payload kosong tanpa refreshToken
    const useCasePayload = {};
    // Instance use case tanpa dependency (karena tidak sampai ke repository)
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert: jalankan execute dan pastikan error dengan pesan tertentu dilempar
    await expect(
      logoutUserUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
    );
  });

  /**
   * Test ini memastikan jika refresh token yang diberikan bukan tipe string,
   * maka use case harus melempar error validasi tipe data.
   * Ini untuk mencegah input yang tidak sesuai tipe diproses lebih lanjut.
   */
  it("should throw error if refresh token not string", async () => {
    // Arrange: buat payload dengan refreshToken bertipe number (bukan string)
    const useCasePayload = {
      refreshToken: 123,
    };
    // Instance use case tanpa dependency (karena masih validasi input)
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert: jalankan execute dan pastikan error validasi tipe data dilempar
    await expect(
      logoutUserUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  /**
   * Test ini menguji skenario happy path di mana:
   * - refresh token sudah valid dan bertipe string
   * - token dicek ketersediaannya di repository
   * - token dihapus dari repository
   * Tujuan test adalah memastikan orchestrasi pemanggilan method repository berjalan sesuai urutan dan parameter.
   */
  it("should orchestrating the delete authentication action correctly", async () => {
    // Arrange: buat payload dengan refreshToken valid
    const useCasePayload = {
      refreshToken: "refreshToken",
    };

    // Buat mock repository dan mock method yang dipakai use case
    const mockAuthenticationRepository = new AuthenticationRepository();

    // Mock checkAvailabilityToken untuk memastikan token tersedia, return Promise.resolve agar sukses
    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Mock deleteToken untuk menghapus token, juga return Promise.resolve agar sukses
    mockAuthenticationRepository.deleteToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Buat instance use case dengan dependency repository mock
    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act: jalankan use case dengan payload valid
    await logoutUserUseCase.execute(useCasePayload);

    // Assert: pastikan checkAvailabilityToken dipanggil dengan refreshToken yang benar
    expect(
      mockAuthenticationRepository.checkAvailabilityToken
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);

    // Assert: pastikan deleteToken juga dipanggil dengan refreshToken yang sama
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    );
  });
});
