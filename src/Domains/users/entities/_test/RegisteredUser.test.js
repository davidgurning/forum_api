const RegisteredUser = require("../RegisteredUser");

// Deskripsi test suite untuk entitas RegisteredUser
describe("a RegisteredUser entities", () => {
  // Test case pertama:
  // Memastikan error dilemparkan jika payload tidak mengandung semua properti yang dibutuhkan
  it("should throw error when payload did not contain needed property", () => {
    // Arrange: Membuat objek payload yang tidak lengkap (tidak ada properti 'id')
    const payload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    };

    // Action & Assert:
    // Saat membuat instance RegisteredUser dengan payload tidak lengkap,
    // harus melempar error dengan pesan 'REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY'
    expect(() => new RegisteredUser(payload)).toThrowError(
      "REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  // Test case kedua:
  // Memastikan error dilemparkan jika tipe data pada payload tidak sesuai spesifikasi
  it("should throw error when payload did not meet data type specification", () => {
    // Arrange: Membuat objek payload dengan tipe data yang salah
    // 'id' seharusnya string tapi diisi angka 123
    // 'fullname' seharusnya string tapi diisi objek kosong {}
    const payload = {
      id: 123,
      username: "dicoding",
      fullname: {},
    };

    // Action & Assert:
    // Saat membuat instance RegisteredUser dengan payload yang salah tipe datanya,
    // harus melempar error dengan pesan 'REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'
    expect(() => new RegisteredUser(payload)).toThrowError(
      "REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  // Test case ketiga:
  // Memastikan RegisteredUser berhasil dibuat dengan properti yang benar dan lengkap
  it("should create registeredUser object correctly", () => {
    // Arrange: Membuat objek payload yang lengkap dan sesuai tipe data
    const payload = {
      id: "user-123",
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    };

    // Action: Membuat instance RegisteredUser dengan payload tersebut
    const registeredUser = new RegisteredUser(payload);

    // Assert: Memastikan properti pada objek registeredUser sama persis dengan payload
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
