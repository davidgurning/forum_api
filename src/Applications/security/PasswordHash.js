// Mendefinisikan kelas PasswordHash sebagai kelas abstrak/interface
// yang bertanggung jawab untuk melakukan hashing password dan membandingkan password.
// Kelas ini berfungsi sebagai blueprint bagi kelas turunan yang akan mengimplementasikan metode-metode ini.
class PasswordHash {
  /**
   * Metode abstrak untuk melakukan hashing pada password plain text.
   * Subclass wajib mengimplementasikan metode ini agar menghasilkan hash dari password yang diberikan.
   *
   * @param {string} password - Password plain text yang akan di-hash.
   * @returns {Promise<string>} Mengembalikan hash dari password.
   * @throws {Error} Melempar error jika metode belum diimplementasikan.
   */
  async hash(password) {
    // Jika metode ini dipanggil tanpa implementasi, maka lempar error khusus ini.
    throw new Error("PASSWORD_HASH.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Metode abstrak untuk membandingkan password plain text dengan password yang sudah di-hash.
   * Subclass wajib mengimplementasikan metode ini untuk memverifikasi apakah password plain cocok dengan hash.
   *
   * @param {string} plain - Password plain text yang akan dibandingkan.
   * @param {string} encrypted - Password hash yang menjadi acuan perbandingan.
   * @returns {Promise<boolean>} Mengembalikan true jika password cocok, false jika tidak.
   * @throws {Error} Melempar error jika metode belum diimplementasikan.
   */
  async comparePassword(plain, encrypted) {
    // Melempar error jika subclass belum menyediakan implementasi fungsi ini.
    throw new Error("PASSWORD_HASH.METHOD_NOT_IMPLEMENTED");
  }
}

// Mengeksport kelas PasswordHash agar bisa digunakan oleh modul lain.
// Biasanya kelas ini akan menjadi kelas dasar yang di-extend oleh kelas implementasi hashing yang nyata,
// misalnya menggunakan bcrypt, argon2, atau algoritma hashing lainnya.
module.exports = PasswordHash;
