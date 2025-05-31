const AddedComment = require("../AddedComment");

describe("a AddedComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange: Payload hanya berisi 'id' dan 'owner', tapi tidak ada 'content'
    const payload = {
      id: "comment-123",
      owner: "user-123",
    };

    // Act & Assert: Membuat objek AddedComment dengan payload ini harus melempar error
    // karena properti 'content' tidak ada, pesan errornya harus sesuai ini
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange: Payload lengkap, tapi tipe data 'content' salah (angka, harusnya string)
    const payload = {
      id: "comment-123",
      content: 123, // tipe data salah
      owner: "user-123",
    };

    // Act & Assert: Membuat objek AddedComment dengan tipe data salah harus melempar error
    // dengan pesan error yang spesifik untuk data type
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create new added comment object correctly", () => {
    // Arrange: Payload lengkap dengan tipe data yang benar semua
    const payload = {
      id: "comment-123",
      content: "Dummy content of comment",
      owner: "user-123",
    };

    // Act: Membuat objek AddedComment dengan payload valid
    const addedComment = new AddedComment(payload);

    // Assert: Pastikan properti objek AddedComment sesuai dengan payload
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
