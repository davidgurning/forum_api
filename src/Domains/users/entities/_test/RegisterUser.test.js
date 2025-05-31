const RegisterUser = require("../RegisterUser");

// Test suite untuk entitas RegisterUser, mengelompokkan semua test terkait RegisterUser
describe("a RegisterUser entities", () => {
  // Test 1: Memastikan error dilempar jika payload tidak lengkap,
  // misalnya properti 'fullname' tidak ada dalam payload
  it("should throw error when payload did not contain needed property", () => {
    // Arrange: Payload hanya memiliki username dan password, tanpa fullname
    const payload = {
      username: "abc",
      password: "abc",
    };

    // Action & Assert:
    // Membuat instance RegisterUser dengan payload yang tidak lengkap harus melempar error
    // dengan pesan 'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'
    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  // Test 2: Memastikan error dilempar jika tipe data pada payload tidak sesuai spesifikasi,
  // misal username harus string tapi diberi angka, fullname harus string tapi diberi boolean
  it("should throw error when payload did not meet data type specification", () => {
    // Arrange: Payload dengan tipe data yang salah
    const payload = {
      username: 123, // seharusnya string
      fullname: true, // seharusnya string
      password: "abc", // benar
    };

    // Action & Assert:
    // Konstruktor harus melempar error 'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'
    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  // Test 3: Memastikan error dilempar jika username lebih dari 50 karakter
  it("should throw error when username contains more than 50 character", () => {
    // Arrange: Payload dengan username yang sangat panjang melebihi 50 karakter
    const payload = {
      username: "dicodingindonesiadicodingindonesiadicodingindonesiadicoding", // > 50 chars
      fullname: "Dicoding Indonesia",
      password: "abc",
    };

    // Action & Assert:
    // Konstruktor harus melempar error 'REGISTER_USER.USERNAME_LIMIT_CHAR'
    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.USERNAME_LIMIT_CHAR"
    );
  });

  // Test 4: Memastikan error dilempar jika username mengandung karakter yang tidak diizinkan (misalnya spasi)
  it("should throw error when username contains restricted character", () => {
    // Arrange: Payload dengan username mengandung spasi yang dianggap karakter terlarang
    const payload = {
      username: "dico ding", // spasi sebagai karakter terlarang
      fullname: "dicoding",
      password: "abc",
    };

    // Action & Assert:
    // Konstruktor harus melempar error 'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'
    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER"
    );
  });

  // Test 5: Memastikan objek RegisterUser berhasil dibuat dengan properti yang valid dan sesuai
  it("should create registerUser object correctly", () => {
    // Arrange: Payload dengan data valid dan lengkap
    const payload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
      password: "abc",
    };

    // Action: Membuat objek RegisterUser dari payload
    const { username, fullname, password } = new RegisterUser(payload);

    // Assert: Memastikan nilai properti yang ada pada objek sesuai dengan payload input
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});
