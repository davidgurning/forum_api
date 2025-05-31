/**
 * Use case untuk menghapus refresh token pada sistem otentikasi.
 * Biasanya digunakan saat proses logout atau pencabutan akses refresh token.
 */
class DeleteAuthenticationUseCase {
  /**
   * Konstruktor kelas DeleteAuthenticationUseCase
   * @param {object} param0 - Objek yang berisi dependensi
   * @param {object} param0.authenticationRepository - Repository untuk operasi terkait autentikasi, khususnya pengelolaan refresh token
   */
  constructor({ authenticationRepository }) {
    // Menyimpan instance repository autentikasi untuk dipakai di metode lain
    this._authenticationRepository = authenticationRepository;
  }

  /**
   * Eksekusi use case untuk menghapus refresh token yang diberikan
   * @param {object} useCasePayload - Payload yang berisi data refreshToken yang akan dihapus
   * @throws {Error} - Jika payload tidak valid atau token tidak tersedia
   */
  async execute(useCasePayload) {
    // Validasi payload agar mengandung properti yang benar dan sesuai tipe data
    this._validatePayload(useCasePayload);

    // Mendestruktur properti refreshToken dari payload
    const { refreshToken } = useCasePayload;

    // Memastikan bahwa refresh token tersebut memang ada (tersimpan) di sistem
    // Jika tidak ditemukan, method ini akan melempar error, sehingga proses berhenti
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);

    // Menghapus refresh token dari repository/sistem sehingga tidak bisa digunakan lagi untuk refresh token
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  /**
   * Metode privat untuk memvalidasi struktur dan tipe data payload yang diterima
   * @param {object} payload - Data payload yang harus berisi properti refreshToken bertipe string
   * @throws {Error} - Jika properti refreshToken tidak ada atau bukan string
   */
  _validatePayload(payload) {
    // Mengambil nilai refreshToken dari payload
    const { refreshToken } = payload;

    // Cek keberadaan properti refreshToken dalam payload
    if (!refreshToken) {
      // Jika tidak ada, lempar error dengan pesan yang jelas untuk debugging dan penanganan
      throw new Error(
        "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }

    // Cek tipe data refreshToken harus string
    if (typeof refreshToken !== "string") {
      // Jika tipe data salah, lempar error dengan pesan yang menjelaskan kegagalan tipe data
      throw new Error(
        "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

// Mengekspor kelas DeleteAuthenticationUseCase agar dapat digunakan pada modul lain (misal controller atau service)
module.exports = DeleteAuthenticationUseCase;
