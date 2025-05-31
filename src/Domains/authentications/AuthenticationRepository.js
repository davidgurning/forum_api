class AuthenticationRepository {
  // Method addToken yang menerima parameter token
  // Karena ini adalah kelas abstrak atau interface, method ini belum diimplementasikan,
  // sehingga langsung melempar error dengan pesan khusus jika dipanggil
  async addToken(token) {
    throw new Error("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Method checkAvailabilityToken yang menerima parameter token
  // Sama seperti addToken, method ini juga belum diimplementasikan,
  // jadi akan melempar error dengan pesan yang sama jika dipanggil
  async checkAvailabilityToken(token) {
    throw new Error("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Method deleteToken yang menerima parameter token
  // Belum diimplementasikan dan akan melempar error jika dipanggil
  async deleteToken(token) {
    throw new Error("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = AuthenticationRepository;
// Mengekspor kelas AuthenticationRepository agar bisa diwariskan (extend) oleh kelas lain
