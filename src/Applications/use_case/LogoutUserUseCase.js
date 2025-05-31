/**
 * Kelas LogoutUserUseCase bertugas untuk menangani proses logout user dengan cara menghapus refresh token dari sistem.
 * Dengan menghapus refresh token, user tidak bisa lagi menggunakan token tersebut untuk mendapatkan access token baru.
 */
class LogoutUserUseCase {
  /**
   * Konstruktor kelas LogoutUserUseCase
   * @param {object} dependencies - Objek berisi dependency yang dibutuhkan use case ini
   * @param {object} dependencies.authenticationRepository - Repository yang bertanggung jawab untuk operasi token autentikasi (pengecekan dan penghapusan token)
   */
  constructor({ authenticationRepository }) {
    // Menyimpan instance authenticationRepository ke property privat untuk digunakan di method lain
    this._authenticationRepository = authenticationRepository;
  }

  /**
   * Metode utama yang akan dijalankan saat proses logout dieksekusi
   * @param {object} useCasePayload - Payload yang berisi data yang dibutuhkan untuk logout, yaitu refreshToken
   * @throws Error jika payload tidak valid atau token tidak tersedia
   */
  async execute(useCasePayload) {
    // Validasi payload apakah sudah memenuhi ketentuan (misal refreshToken ada dan bertipe string)
    this._validatePayload(useCasePayload);

    // Mengambil refreshToken dari payload yang diberikan
    const { refreshToken } = useCasePayload;

    // Mengecek apakah refreshToken tersebut masih tersedia (terdaftar dan valid) di sistem
    // Jika token tidak ditemukan, repository biasanya akan melempar error
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);

    // Menghapus refreshToken tersebut dari penyimpanan repository
    // Ini berarti token tersebut tidak bisa digunakan lagi untuk mendapatkan access token baru
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  /**
   * Metode privat untuk validasi payload input
   * Memastikan bahwa payload mengandung refreshToken dan bertipe string
   * @param {object} payload - Payload dari eksekusi logout
   * @throws Error jika refreshToken tidak ada atau bukan string
   */
  _validatePayload(payload) {
    const { refreshToken } = payload;

    // Cek apakah refreshToken ada (tidak null, undefined, atau string kosong)
    if (!refreshToken) {
      // Jika tidak ada, lempar error dengan pesan spesifik agar bisa diketahui penyebabnya
      throw new Error(
        "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }

    // Cek apakah tipe data refreshToken adalah string
    if (typeof refreshToken !== "string") {
      // Jika tipe data tidak sesuai, lempar error yang menjelaskan masalah tipe data payload
      throw new Error(
        "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

// Mengekspor kelas LogoutUserUseCase agar dapat digunakan di modul lain, seperti controller atau service
module.exports = LogoutUserUseCase;
