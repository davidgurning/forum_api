// Import class AddedReply yang akan diuji
const AddedReply = require("../AddedReply");

// Deskripsi grup pengujian untuk entitas AddedReply
describe("a AddedReply entities", () => {
  // Test case 1: Cek error ketika payload tidak memiliki properti yang dibutuhkan
  it("should throw error when payload did not contain needed property", () => {
    // Payload ini sengaja tidak menyertakan properti 'content'
    const payload = {
      id: "reply-123", // sudah ada id
      owner: "user-123", // sudah ada owner
      // content tidak disediakan, padahal wajib
    };

    // Membuat instance AddedReply dengan payload yang tidak lengkap harus melempar error
    // Kita menggunakan fungsi yang dibungkus dalam arrow function karena kita ingin menguji **error saat constructor dijalankan**
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
    // Dengan kata lain, jika payload tidak menyertakan salah satu properti wajib,
    // maka harus melempar error dengan pesan 'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
  });

  // Test case 2: Cek error ketika payload memiliki tipe data yang salah
  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: "reply-123",
      content: 123, // Salah: content seharusnya string, tapi ini number
      owner: "user-123",
    };

    // Seperti sebelumnya, kita mengharapkan error dilempar karena tipe data tidak sesuai
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    // Artinya, AddedReply harus melakukan validasi tipe data, dan jika salah, error dilempar.
  });

  // Test case 3: Cek apakah AddedReply berhasil membuat objek dengan benar jika payload valid
  it("should create new added reply object correctly", () => {
    // Payload valid: semua properti ada dan bertipe string
    const payload = {
      id: "reply-123",
      content: "Dummy content of reply",
      owner: "user-123",
    };

    // Buat objek AddedReply dengan payload valid
    const addedReply = new AddedReply(payload);

    // Pastikan setiap properti objek hasil konstruktor sama dengan payload
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);

    // Ini memastikan bahwa AddedReply menyimpan data dengan benar
  });
});
