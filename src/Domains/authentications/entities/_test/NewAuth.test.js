const NewAuth = require("../NewAuth");
// Mengimpor kelas NewAuth yang kemungkinan adalah entitas untuk menyimpan data autentikasi baru.

describe("NewAuth entities", () => {
  // Membuat test suite dengan nama 'NewAuth entities' untuk menguji fungsi dan validasi kelas NewAuth

  it("should throw error when payload not contain needed property", () => {
    // Test case ini menguji apakah constructor NewAuth akan melempar error
    // jika objek payload yang diberikan tidak memiliki properti yang dibutuhkan.

    // Arrange
    const payload = {
      accessToken: "accessToken",
      // Properti refreshToken sengaja tidak dimasukkan agar tes memicu error.
    };

    // Action & Assert
    expect(() => new NewAuth(payload)).toThrowError(
      "NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY"
    );
    // Memanggil constructor NewAuth dengan payload yang kurang properti.
    // Test ini berharap akan melempar error dengan pesan spesifik 'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY'.
  });

  it("should throw error when payload not meet data type specification", () => {
    // Test case ini menguji apakah constructor NewAuth akan melempar error
    // jika tipe data dari properti payload tidak sesuai spesifikasi.

    // Arrange
    const payload = {
      accessToken: "accessToken",
      refreshToken: 1234, // refreshToken harusnya string, tapi di sini sengaja diberikan number
    };

    // Action & Assert
    expect(() => new NewAuth(payload)).toThrowError(
      "NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    // Memanggil constructor NewAuth dengan payload yang tipe datanya salah.
    // Test ini berharap akan melempar error dengan pesan 'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION'.
  });

  it("should create NewAuth entities correctly", () => {
    // Test case ini menguji apakah constructor NewAuth berhasil membuat objek dengan benar
    // ketika diberikan payload yang valid.

    // Arrange
    const payload = {
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    };

    // Action
    const newAuth = new NewAuth(payload);
    // Membuat objek newAuth dengan payload yang lengkap dan benar

    // Assert
    expect(newAuth).toBeInstanceOf(NewAuth);
    // Memastikan objek yang dibuat merupakan instance dari kelas NewAuth

    expect(newAuth.accessToken).toEqual(payload.accessToken);
    // Memastikan properti accessToken pada objek newAuth sesuai dengan payload

    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
    // Memastikan properti refreshToken pada objek newAuth sesuai dengan payload
  });
});
