/**
 * Kelas RefreshAuthenticationUseCase bertugas untuk menangani proses "refresh token" pada sistem autentikasi.
 * Proses ini memungkinkan user mendapatkan access token baru menggunakan refresh token yang valid.
 *
 * Refresh token digunakan untuk menjaga keamanan sesi user tanpa harus melakukan login ulang berkali-kali,
 * dengan memberikan access token baru ketika token lama sudah kadaluarsa.
 */
class RefreshAuthenticationUseCase {
  /**
   * Konstruktor kelas RefreshAuthenticationUseCase
   * @param {object} dependencies - Objek yang berisi dependency yang dibutuhkan use case ini
   * @param {object} dependencies.authenticationRepository - Repository yang mengelola penyimpanan dan pengecekan token refresh
   * @param {object} dependencies.authenticationTokenManager - Manajer token yang bertanggung jawab untuk verifikasi, decoding, dan pembuatan token JWT
   */
  constructor({ authenticationRepository, authenticationTokenManager }) {
    // Simpan instance repository dan token manager ke property privat
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  /**
   * Metode utama yang menjalankan proses refresh token
   * @param {object} useCasePayload - Payload berisi data yang dibutuhkan, khususnya refreshToken
   * @returns {string} accessToken baru yang dihasilkan setelah refresh token berhasil diverifikasi
   * @throws Error jika payload tidak valid atau token refresh tidak valid/tidak tersedia
   */
  async execute(useCasePayload) {
    // Validasi struktur dan tipe data payload (harus ada refreshToken dan berupa string)
    this._verifyPayload(useCasePayload);

    // Ambil refreshToken dari payload
    const { refreshToken } = useCasePayload;

    // Verifikasi keaslian dan validitas refreshToken (misal: valid signature, belum expired)
    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);

    // Cek ketersediaan refreshToken di repository (pastikan token belum dihapus atau diblokir)
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);

    // Decode payload JWT untuk mengambil informasi user (misal: username dan id)
    const { username, id } =
      await this._authenticationTokenManager.decodePayload(refreshToken);

    // Buat accessToken baru menggunakan informasi user yang sudah didecode
    // Access token ini akan digunakan client untuk autentikasi akses resource yang dilindungi
    return this._authenticationTokenManager.createAccessToken({ username, id });
  }

  /**
   * Metode privat untuk memverifikasi payload input dari user
   * Memastikan payload memiliki properti refreshToken dan bertipe string
   * @param {object} payload - Data payload dari permintaan refresh token
   * @throws Error jika payload tidak memenuhi persyaratan yang ditentukan
   */
  _verifyPayload(payload) {
    const { refreshToken } = payload;

    // Cek keberadaan refreshToken
    if (!refreshToken) {
      // Jika tidak ada, lempar error dengan pesan spesifik
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }

    // Cek tipe data refreshToken harus string
    if (typeof refreshToken !== "string") {
      // Jika bukan string, lempar error terkait tipe data payload yang tidak sesuai
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

// Mengekspor kelas RefreshAuthenticationUseCase agar dapat digunakan pada bagian lain aplikasi
module.exports = RefreshAuthenticationUseCase;
