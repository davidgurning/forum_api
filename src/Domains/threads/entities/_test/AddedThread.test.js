const AddedThread = require("../AddedThread"); // Mengimpor kelas AddedThread yang akan diuji

// Mendefinisikan suite test dengan deskripsi "a AddedThread entity"
describe("a AddedThread entity", () => {
  // Test pertama: Menguji apakah error dilempar ketika payload tidak mengandung properti yang dibutuhkan
  it("should throw error when payload did not contain needed property", () => {
    // Membuat payload yang hanya berisi id dan owner, tanpa title yang seharusnya ada
    const payload = {
      id: "thread-123",
      owner: "user-123",
    };

    // Mengecek apakah saat membuat instance AddedThread dengan payload tersebut
    // akan melempar error dengan pesan 'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  // Test kedua: Menguji apakah error dilempar ketika tipe data pada payload tidak sesuai spesifikasi
  it("should throw error when payload did not meet data type specification", () => {
    // Arrange: Membuat payload dengan tipe data owner yang salah (seharusnya string, tapi diberikan number)
    const payload = {
      id: "thread-123",
      title: "dummy title",
      owner: 9000, // tipe data salah
    };

    // Action & Assert: Mengecek apakah membuat instance AddedThread dengan payload ini
    // melempar error 'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  // Test ketiga: Menguji apakah objek AddedThread dibuat dengan benar saat payload valid
  it("should create AddedThread object correctly", () => {
    // Arrange: Payload lengkap dengan semua properti dan tipe data yang benar
    const payload = {
      id: "thread-123",
      title: "some title",
      owner: "user-123",
    };

    // Action: Membuat instance AddedThread dengan payload valid
    const addedThread = new AddedThread(payload);

    // Assert: Mengecek properti pada objek addedThread sesuai dengan payload yang diberikan
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
