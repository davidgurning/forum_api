const UserLogin = require("../UserLogin");

// Test suite untuk entitas UserLogin, mengelompokkan semua pengujian terkait UserLogin
describe("UserLogin entities", () => {
  // Test 1: Memastikan error dilempar ketika payload tidak lengkap,
  // misalnya properti 'password' tidak ada dalam payload
  it("should throw error when payload does not contain needed property", () => {
    // Arrange: Payload hanya memiliki username, tanpa password
    const payload = {
      username: "dicoding",
    };

    // Action & Assert:
    // Membuat instance UserLogin dengan payload yang tidak lengkap harus melempar error
    // dengan pesan 'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY'
    expect(() => new UserLogin(payload)).toThrowError(
      "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  // Test 2: Memastikan error dilempar ketika tipe data pada payload tidak sesuai,
  // misalnya password harus string tapi diberi angka
  it("should throw error when payload not meet data type specification", () => {
    // Arrange: Payload dengan tipe data yang salah untuk password
    const payload = {
      username: "dicoding",
      password: 12345, // seharusnya string
    };

    // Action & Assert:
    // Konstruktor UserLogin harus melempar error 'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION'
    expect(() => new UserLogin(payload)).toThrowError(
      "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  // Test 3: Memastikan objek UserLogin berhasil dibuat dengan properti yang valid dan sesuai
  it("should create UserLogin entities correctly", () => {
    // Arrange: Payload valid dan lengkap
    const payload = {
      username: "dicoding",
      password: "12345",
    };

    // Action: Membuat objek UserLogin dari payload
    const userLogin = new UserLogin(payload);

    // Assert:
    // Memastikan objek yang dibuat adalah instance dari UserLogin
    expect(userLogin).toBeInstanceOf(UserLogin);
    // Memastikan nilai properti username dan password sesuai payload input
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
