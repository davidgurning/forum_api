class UserRepository {
  // Method abstrak untuk menambahkan user baru ke repository/database
  // Parameter: registerUser (objek yang berisi data user yang ingin didaftarkan)
  // Karena ini adalah interface/base class, method ini belum diimplementasikan,
  // sehingga melempar error jika dipanggil langsung
  async addUser(registerUser) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Method abstrak untuk memverifikasi apakah username tersedia (belum dipakai oleh user lain)
  // Parameter: username (string) - username yang ingin dicek ketersediaannya
  // Belum diimplementasikan di kelas ini, hanya sebagai kontrak method yang harus ada
  async verifyAvailableUsername(username) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Method abstrak untuk mengambil password hash dari username tertentu
  // Parameter: username (string) - username yang ingin diambil password-nya
  // Belum diimplementasikan, harus diimplementasikan di subclass yang spesifik
  async getPasswordByUsername(username) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Method abstrak untuk mengambil user ID berdasarkan username
  // Parameter: username (string) - username yang ingin diambil ID-nya
  // Melempar error jika belum diimplementasikan
  async getIdByUsername(username) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

// Mengekspor kelas UserRepository untuk digunakan sebagai interface/base class di modul lain
module.exports = UserRepository;
