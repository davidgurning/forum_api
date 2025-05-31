const AuthenticationRepository = require("../../../Domains/authentications/AuthenticationRepository");
const DeleteAuthenticationUseCase = require("../DeleteAuthenticationUseCase");

describe("DeleteAuthenticationUseCase", () => {
  // Test pertama: memastikan error dilempar jika payload tidak mengandung refreshToken
  it("should throw error if use case payload not contain refresh token", async () => {
    // Arrange: siapkan payload kosong tanpa refreshToken
    const useCasePayload = {};
    // Buat instance use case tanpa repository (karena hanya testing validasi payload)
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

    // Action & Assert:
    // Mengeksekusi use case dengan payload kosong harus melempar error dengan pesan spesifik
    await expect(
      deleteAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
    );
  });

  // Test kedua: memastikan error dilempar jika tipe data refreshToken bukan string
  it("should throw error if refresh token not string", async () => {
    // Arrange: siapkan payload dengan refreshToken yang bukan string (number)
    const useCasePayload = {
      refreshToken: 123,
    };
    // Buat instance use case tanpa repository
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

    // Action & Assert:
    // Mengeksekusi use case dengan refreshToken tipe bukan string harus melempar error dengan pesan spesifik
    await expect(
      deleteAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  // Test ketiga: memastikan use case menjalankan alur penghapusan token secara benar
  it("should orchestrating the delete authentication action correctly", async () => {
    // Arrange:
    // Payload valid dengan refreshToken string
    const useCasePayload = {
      refreshToken: "refreshToken",
    };

    // Buat mock AuthenticationRepository untuk menggantikan implementasi asli
    const mockAuthenticationRepository = new AuthenticationRepository();

    // Mock method checkAvailabilityToken agar return Promise resolve (tidak error)
    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Mock method deleteToken agar return Promise resolve (tidak error)
    mockAuthenticationRepository.deleteToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Buat instance use case dengan dependency injection repository mock
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act: jalankan fungsi execute dengan payload valid
    await deleteAuthenticationUseCase.execute(useCasePayload);

    // Assert:
    // Pastikan checkAvailabilityToken dipanggil dengan refreshToken yang benar
    expect(
      mockAuthenticationRepository.checkAvailabilityToken
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);

    // Pastikan deleteToken juga dipanggil dengan refreshToken yang sama
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    );
  });
});
