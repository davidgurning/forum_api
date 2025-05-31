const AddComment = require("../AddComment");

describe("an AddComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange: Payload hanya berisi 'owner' dan 'thread_id', tapi tidak ada 'content'
    const payload = {
      owner: "user-123",
      thread_id: "thread-123",
    };

    // Act & Assert: Membuat objek AddComment dengan payload ini harus melempar error
    // karena properti 'content' tidak ada, errornya harus sesuai dengan pesan ini
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange: Payload sudah lengkap, tapi tipe data 'thread_id' salah (angka, harusnya string)
    const payload = {
      owner: "user-123",
      thread_id: 123, // tipe data salah
      content: "Dummy content of comment",
    };

    // Act & Assert: Membuat objek AddComment dengan tipe data tidak sesuai harus melempar error
    // dengan pesan error yang spesifik untuk data type
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddComment object correctly", () => {
    // Arrange: Payload lengkap dan tipe data sudah benar semua
    const payload = {
      owner: "user-123",
      thread_id: "thread-123",
      content: "Dummy content of comment",
    };

    // Act: Membuat objek AddComment menggunakan payload yang valid
    const { owner, thread_id, content } = new AddComment(payload);

    // Assert: Pastikan nilai properti pada objek AddComment sesuai dengan payload
    expect(owner).toEqual(payload.owner);
    expect(thread_id).toEqual(payload.thread_id);
    expect(content).toEqual(payload.content);
  });
});
