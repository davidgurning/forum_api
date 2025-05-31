const GetThread = require("../GetThread");
// Mengimpor kelas GetThread dari modul ../GetThread untuk diuji

// Mendefinisikan test suite dengan nama "a GetThread entity"
describe("a GetThread entity", () => {
  // Test pertama: Memastikan error dilempar jika payload tidak lengkap properti yang dibutuhkan
  it("should throw an error when did not contain needed property", () => {
    // Arrange: Membuat payload yang tidak memiliki properti 'id' (wajib ada)
    const payload = {
      title: "Dummy thread title",
      body: "Dummy thread body",
      date: "2025-05-23T01:01:01.001Z",
      username: "dicoding",
    };

    // Action & Assert: Saat membuat GetThread dengan payload ini,
    // harus melempar error dengan pesan 'GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    expect(() => new GetThread(payload)).toThrowError(
      "GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  // Test kedua: Memastikan error dilempar jika tipe data properti payload tidak sesuai spesifikasi
  it("should throw an error when did not meet data type specification", () => {
    // Arrange: Payload dengan tipe data yang salah,
    // 'id' harus string, diberikan angka
    // 'body' harus string, diberikan angka
    // 'date' harus string (ISO date), diberikan angka
    const payload = {
      id: 90000, // salah tipe data, harus string
      title: "Dummy title",
      body: 123, // salah tipe data, harus string
      date: 2025, // salah tipe data, harus string ISO date
      username: "dicoding",
    };

    // Action & Assert: Membuat GetThread dengan payload salah tipe data harus melempar error
    // dengan pesan 'GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    expect(() => new GetThread(payload)).toThrowError(
      "GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  // Test ketiga: Memastikan objek GetThread dibuat dengan benar dari payload valid
  it("should return GetThread object correctly", () => {
    // Arrange: Payload valid dengan semua properti yang lengkap dan tipe data benar
    const payload = {
      id: "thread-123",
      title: "Dummy thread title",
      body: "Dummy thread body",
      date: "2025-05-23T01:01:01.001Z", // format tanggal ISO string
      username: "dicoding",
    };

    // Action: Membuat instance GetThread dari payload
    const getThread = new GetThread(payload);

    // Assert: Memastikan properti objek sama dengan nilai payload
    // Khusus properti date, memastikan output diubah menjadi ISO string yang valid
    expect(getThread.id).toEqual(payload.id);
    expect(getThread.title).toEqual(payload.title);
    expect(getThread.body).toEqual(payload.body);
    expect(getThread.date).toEqual(new Date(payload.date).toISOString());
    expect(getThread.username).toEqual(payload.username);
  });
});
