const AddThread = require("../AddThread"); // Mengimpor kelas AddThread yang akan diuji

// Mendefinisikan test suite dengan nama "a AddThread entities"
describe("a AddThread entities", () => {
  // Test pertama: Memastikan error dilempar jika properti yang dibutuhkan tidak lengkap di payload
  it("should throw error when payload did not contain needed property", () => {
    // Arrange: Membuat payload tanpa properti 'owner' yang wajib ada
    const payload = {
      title: "dummy title",
      body: "dummy body",
    };

    // Action & Assert: Memastikan saat membuat AddThread dengan payload ini,
    // error dengan pesan "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY" dilempar
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  // Test kedua: Memastikan error dilempar jika tipe data properti payload tidak sesuai
  it("should throw error when payload did not meet data type specification", () => {
    // Arrange: Membuat payload dengan tipe data yang salah,
    // body dan owner harusnya string, tapi diberikan angka
    const payload = {
      title: "dummy title",
      body: 900000, // tipe salah
      owner: 19999, // tipe salah
    };

    // Action & Assert: Memastikan error "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    // dilempar ketika membuat AddThread dengan payload tersebut
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  // Test ketiga: Memastikan error dilempar jika panjang karakter title melebihi 50
  it("should throw error when title contains more than 50 character", () => {
    // Arrange: Membuat payload dengan title yang panjangnya lebih dari 50 karakter
    const payload = {
      title:
        "This title contain more than 50 character, This title contain more than 50 character",
      body: "dummy body",
      owner: "user-123",
    };

    // Action & Assert: Memastikan error "ADD_THREAD.TITLE_LIMIT_CHAR"
    // dilempar saat membuat AddThread dengan title terlalu panjang
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.TITLE_LIMIT_CHAR"
    );
  });

  // Test keempat: Memastikan objek AddThread dibuat dengan benar saat payload valid
  it("should create newThread object correctly", () => {
    // Arrange: Payload valid dengan semua properti dan tipe data yang benar
    const payload = {
      title: "dummy title",
      body: "dummy body thread",
      owner: "user-123",
    };

    // Action: Membuat instance AddThread dan destruktur properti yang ada
    const { title, body, owner } = new AddThread(payload);

    // Assert: Memastikan properti pada objek AddThread sama dengan nilai di payload
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
