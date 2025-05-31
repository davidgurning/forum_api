// Mendefinisikan kelas AuthenticationTokenManager yang berfungsi sebagai interface/kelas abstrak
// untuk manajemen token autentikasi seperti access token dan refresh token.
class AuthenticationTokenManager {
  /**
   * Metode abstrak untuk membuat refresh token.
   * Subclass wajib mengimplementasikan metode ini agar menghasilkan refresh token dari payload yang diberikan.
   *
   * @param {Object} payload - Data yang akan dimasukkan ke dalam token.
   * @throws {Error} Melempar error bahwa metode ini belum diimplementasikan.
   */
  async createRefreshToken(payload) {
    // Jika metode ini dipanggil tanpa implementasi, maka lempar error khusus ini.
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Metode abstrak untuk membuat access token.
   * Subclass wajib mengimplementasikan metode ini untuk menghasilkan access token dari payload.
   *
   * @param {Object} payload - Data yang akan dienkode dalam token akses.
   * @throws {Error} Melempar error bahwa metode ini belum diimplementasikan.
   */
  async createAccessToken(payload) {
    // Error ini memastikan subclass tidak lupa mengimplementasikan fungsi ini.
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Metode abstrak untuk memverifikasi refresh token yang diterima.
   * Subclass wajib mengimplementasikan metode ini agar dapat memvalidasi keabsahan refresh token.
   *
   * @param {string} token - Refresh token yang akan diverifikasi.
   * @throws {Error} Melempar error bahwa metode ini belum diimplementasikan.
   */
  async verifyRefreshToken(token) {
    // Memastikan pemanggil mendapatkan error jika belum diimplementasi.
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Metode abstrak untuk mendekode payload dari token.
   * Subclass wajib mengimplementasikan metode ini untuk mengambil data payload asli dari token.
   *
   * @throws {Error} Melempar error bahwa metode ini belum diimplementasikan.
   */
  async decodePayload() {
    // Error ini mengingatkan bahwa decodePayload harus diimplementasi.
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }
}

// Mengeksport kelas AuthenticationTokenManager agar dapat digunakan oleh modul lain.
// Biasanya kelas ini akan diturunkan (extends) oleh kelas lain yang mengimplementasikan metode-metode tersebut.
module.exports = AuthenticationTokenManager;
