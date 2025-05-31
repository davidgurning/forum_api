// Import entity UserLogin yang merepresentasikan data login user yang valid dan terstruktur
const UserLogin = require("../../Domains/users/entities/UserLogin");
// Import entity NewAuthentication yang merepresentasikan objek token autentikasi baru (access + refresh token)
const NewAuthentication = require("../../Domains/authentications/entities/NewAuth");

class LoginUserUseCase {
  /**
   * Konstruktor untuk LoginUserUseCase
   * @param {object} dependencies - Objek yang berisi semua dependency yang dibutuhkan
   * @param {object} dependencies.userRepository - Repository untuk operasi terkait user (misal mengambil data user)
   * @param {object} dependencies.authenticationRepository - Repository untuk menyimpan token autentikasi
   * @param {object} dependencies.authenticationTokenManager - Service untuk membuat dan mengelola token JWT
   * @param {object} dependencies.passwordHash - Service untuk melakukan hash dan verifikasi password
   */
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }) {
    // Menyimpan instance repository dan service ke property privat untuk digunakan di method lainnya
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  /**
   * Metode utama untuk mengeksekusi proses login user
   * @param {object} useCasePayload - Payload yang berisi username dan password yang dikirim user
   * @returns {NewAuthentication} - Objek berisi accessToken dan refreshToken yang baru dibuat
   * @throws Error - Jika username tidak ditemukan, password salah, atau terjadi kegagalan lain saat proses login
   */
  async execute(useCasePayload) {
    // Membuat instance UserLogin untuk validasi dan memastikan payload sudah sesuai format yang diharapkan
    const { username, password } = new UserLogin(useCasePayload);

    // Mengambil password terenkripsi (hashed password) dari database berdasarkan username
    const encryptedPassword = await this._userRepository.getPasswordByUsername(
      username
    );

    // Membandingkan password plaintext dari input user dengan password terenkripsi yang diambil dari database
    // Jika password tidak cocok, akan dilempar error (biasanya AuthenticationError)
    await this._passwordHash.comparePassword(password, encryptedPassword);

    // Mengambil id user berdasarkan username, biasanya sebagai identifier user unik di sistem
    const id = await this._userRepository.getIdByUsername(username);

    // Membuat access token JWT berisi payload minimal username dan id user
    // Access token ini digunakan untuk otorisasi akses endpoint yang dilindungi
    const accessToken =
      await this._authenticationTokenManager.createAccessToken({
        username,
        id,
      });

    // Membuat refresh token JWT yang juga berisi payload username dan id user
    // Refresh token digunakan untuk mendapatkan access token baru saat access token habis masa berlakunya
    const refreshToken =
      await this._authenticationTokenManager.createRefreshToken({
        username,
        id,
      });

    // Membuat objek NewAuthentication yang merepresentasikan token autentikasi yang baru saja dibuat
    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    // Menyimpan refresh token ke repository agar dapat diverifikasi dan dikelola (misal revoke saat logout)
    await this._authenticationRepository.addToken(
      newAuthentication.refreshToken
    );

    // Mengembalikan objek token autentikasi (access dan refresh token) sebagai hasil eksekusi login
    return newAuthentication;
  }
}

// Mengekspor kelas LoginUserUseCase agar bisa digunakan di lapisan lain seperti controller atau service
module.exports = LoginUserUseCase;
