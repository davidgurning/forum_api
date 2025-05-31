// Mengimpor class AddReply yang akan diuji
const AddReply = require("../AddReply");

// Grup pengujian (test suite) untuk entitas AddReply
describe("a AddReply entities", () => {
  // Test case 1: Validasi properti wajib (required property)
  it("should throw error when payload did not contain needed property", () => {
    // Payload ini tidak lengkap — properti 'thread_id' dan 'content' hilang
    const payload = {
      owner: "user-123",
      comment_id: "comment-123",
    };

    // Kita ingin memastikan bahwa AddReply akan melempar error
    // karena properti penting (thread_id dan content) tidak disertakan
    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  // Test case 2: Validasi tipe data
  it("should throw error when payload did not meet data type specification", () => {
    // Payload ini memiliki semua properti yang dibutuhkan
    // Namun properti 'content' salah tipe (harus string, diisi number)
    const payload = {
      owner: "user-123",
      thread_id: "thread-123",
      comment_id: "comment-123",
      content: 123, // ❌ salah tipe data, seharusnya string
    };

    // Kita harapkan konstruktor AddReply akan melempar error karena
    // ada properti yang tidak sesuai spesifikasi tipe data
    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  // Test case 3: Jika semua valid, objek dibuat dengan benar
  it("should create new reply object correctly", () => {
    // Payload valid: semua properti ada dan bertipe string
    const payload = {
      owner: "user-123",
      thread_id: "thread-123",
      comment_id: "comment-123",
      content: "Dummy content of reply",
    };

    // Membuat instance dari AddReply
    const { thread_id, owner, comment_id, content } = new AddReply(payload);

    // Mengecek apakah nilai yang ada di instance sesuai dengan payload
    expect(thread_id).toEqual(payload.thread_id);
    expect(owner).toEqual(payload.owner);
    expect(comment_id).toEqual(payload.comment_id);
    expect(content).toEqual(payload.content);
  });
});
