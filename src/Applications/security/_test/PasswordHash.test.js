// Mengimpor modul EncryptionHelper dari file relatif '../PasswordHash'
// EncryptionHelper diasumsikan sebagai kelas abstrak/interface yang menyediakan metode enkripsi password
const EncryptionHelper = require("../PasswordHash");

// Mendefinisikan suite pengujian dengan Jest untuk interface EncryptionHelper
describe("EncryptionHelper interface", () => {
  // Unit test yang menguji apakah metode abstrak di EncryptionHelper melempar error saat dipanggil
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange: Membuat instance baru dari EncryptionHelper
    // Karena ini adalah kelas abstrak, metode-metode utamanya belum diimplementasikan
    const encryptionHelper = new EncryptionHelper();

    // Action & Assert: Melakukan pengujian bahwa setiap metode abstrak saat dipanggil
    // akan melempar error spesifik 'PASSWORD_HASH.METHOD_NOT_IMPLEMENTED' yang menandakan
    // metode tersebut memang belum diimplementasikan dan wajib diimplementasikan oleh kelas turunan

    // Menguji method 'hash' dengan argumen dummy_password
    // Ekspektasi: Promise akan ditolak dan error dengan pesan 'PASSWORD_HASH.METHOD_NOT_IMPLEMENTED' dilempar
    await expect(encryptionHelper.hash("dummy_password")).rejects.toThrowError(
      "PASSWORD_HASH.METHOD_NOT_IMPLEMENTED"
    );

    // Menguji method 'comparePassword' dengan argumen 'plain' dan 'encrypted'
    // Ekspektasi: Promise akan ditolak dengan error yang sama,
    // menandakan method ini juga harus diimplementasikan di subclass
    await expect(
      encryptionHelper.comparePassword("plain", "encrypted")
    ).rejects.toThrowError("PASSWORD_HASH.METHOD_NOT_IMPLEMENTED");
  });
});
