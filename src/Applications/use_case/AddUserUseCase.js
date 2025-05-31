// Mengimpor entitas RegisterUser yang merepresentasikan data user yang akan didaftarkan
const RegisterUser = require("../../Domains/users/entities/RegisterUser");

class AddUserUseCase {
  /**
   * Konstruktor kelas AddUserUseCase
   * @param {object} param0 - Objek yang berisi dependency injection
   * @param {object} param0.userRepository - Repository user untuk akses data user di database
   * @param {object} param0.passwordHash - Utility untuk hashing password user sebelum disimpan
   */
  constructor({ userRepository, passwordHash }) {
    // Menyimpan instance userRepository pada properti privat _userRepository
    // Bertanggung jawab melakukan operasi terkait user di database (cek username, tambah user, dll)
    this._userRepository = userRepository;

    // Menyimpan instance passwordHash pada properti privat _passwordHash
    // Bertugas meng-hash password agar tidak disimpan dalam bentuk plain text demi keamanan
    this._passwordHash = passwordHash;
  }

  /**
   * Eksekusi use case untuk menambahkan user baru ke sistem
   * @param {object} useCasePayload - Data input dari user yang ingin didaftarkan,
   * biasanya berisi properti seperti username, password, fullname, dll
   * @returns {Promise<object>} - Mengembalikan data user yang sudah berhasil ditambahkan
   * @throws {Error} - Jika username sudah dipakai, atau ada kesalahan validasi
   */
  async execute(useCasePayload) {
    // Membuat instance RegisterUser dari payload input
    // Tujuannya agar data user tervalidasi sesuai aturan entitas RegisterUser
    const registerUser = new RegisterUser(useCasePayload);

    // Memanggil method verifyAvailableUsername di userRepository
    // untuk memastikan username yang diinput belum dipakai oleh user lain
    // Jika sudah ada yang pakai, biasanya method ini melempar error
    await this._userRepository.verifyAvailableUsername(registerUser.username);

    // Melakukan hashing password sebelum disimpan
    // Mengganti properti password di objek registerUser dengan hasil hash
    registerUser.password = await this._passwordHash.hash(
      registerUser.password
    );

    // Memanggil method addUser di userRepository untuk menyimpan data user baru ke database
    // Mengoper objek registerUser yang sudah ter-hash password-nya
    // Return-nya biasanya adalah data user yang sudah tersimpan (misal id, username, fullname)
    return this._userRepository.addUser(registerUser);
  }
}

// Mengeksport kelas AddUserUseCase agar bisa digunakan di bagian lain aplikasi
module.exports = AddUserUseCase;
