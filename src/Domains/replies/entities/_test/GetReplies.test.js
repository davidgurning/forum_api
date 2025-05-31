// Mengimpor class GetReplies dari file GetReplies.js
const GetReplies = require("../GetReplies");

// Mendefinisikan satu grup pengujian untuk class GetReplies
describe("a GetReplies entities", () => {
  // 1. Test Case: Mengecek jika payload tidak mengandung properti yang dibutuhkan
  it("should throw error when payload did not contain needed property", () => {
    // Payload ini tidak memiliki properti 'content' dalam reply (harusnya ada)
    const payload = {
      replies: [
        {
          id: "reply-123",
          username: "dicoding",
          date: "2025-05-23T01:01:01.001Z",
          deleted_at: "", // 'content' tidak disertakan
        },
      ],
    };

    // Mengharapkan fungsi constructor GetReplies akan melempar error
    expect(() => new GetReplies(payload)).toThrowError(
      "GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  // 2. Test Case: Mengecek jika data tidak memenuhi spesifikasi tipe data
  it("should throw error when payload did not meet data type specification", () => {
    // Payload replies harus berupa array, ini salah karena objek
    const payload = {
      replies: {},
    };

    // Payload username bertipe number (seharusnya string)
    const payload2 = {
      replies: [
        {
          id: "reply-123",
          username: 123, // Salah tipe
          date: "2025-05-23T01:01:01.001Z",
          content: "Dummy content of reply",
          deleted_at: null,
        },
      ],
    };

    // Payload deleted_at bertipe number (seharusnya string/null)
    const payload3 = {
      replies: [
        {
          id: "reply-123",
          username: "dicoding",
          date: "2025-05-24T01:01:01.001Z",
          content: "Dummy content of reply",
          deleted_at: 123, // Salah tipe
        },
      ],
    };

    // Semua payload di atas harus melempar error karena tipe data tidak sesuai
    expect(() => new GetReplies(payload)).toThrowError(
      "GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new GetReplies(payload2)).toThrowError(
      "GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new GetReplies(payload3)).toThrowError(
      "GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  // 3. Test Case: Mengecek apakah remapping data balasan dilakukan dengan benar
  it("should remap replies data correctly", () => {
    // Payload reply yang valid (tidak dihapus)
    const payload = {
      replies: [
        {
          id: "reply-123",
          username: "dicoding",
          date: "2025-05-23T01:01:01.001Z",
          content: "Dummy content of reply",
          deleted_at: null, // reply belum dihapus
        },
      ],
    };

    // Memanggil constructor dan destructuring hasilnya
    const { replies } = new GetReplies(payload);

    // Hasil yang diharapkan tidak mengandung field `deleted_at`, hanya properti bersih
    const expectedReply = [
      {
        id: "reply-123",
        username: "dicoding",
        date: "2025-05-23T01:01:01.001Z",
        content: "Dummy content of reply",
      },
    ];

    // Hasil mapping harus sama seperti yang diharapkan
    expect(replies).toEqual(expectedReply);
  });

  // 4. Test Case: Memastikan bahwa data balasan yang sudah dihapus diubah isinya
  it("should create GetReplies object correctly", () => {
    // Payload memiliki 2 reply: satu dihapus, satu tidak
    const payload = {
      replies: [
        {
          id: "reply-123",
          username: "dicoding",
          date: "2025-05-23T01:01:01.001Z",
          content: "Dummy content of reply",
          deleted_at: "2025-05-24T01:01:01.001Z", // reply sudah dihapus
        },
        {
          id: "reply-124",
          username: "sitoruszs",
          date: "2025-05-24T01:01:01.001Z",
          content: "Dummy content of reply",
          deleted_at: null, // belum dihapus
        },
      ],
    };

    // Data yang diharapkan: reply pertama diganti kontennya, reply kedua tetap
    const expected = {
      replies: [
        {
          id: "reply-123",
          username: "dicoding",
          date: "2025-05-23T01:01:01.001Z",
          content: "**balasan telah dihapus**", // konten diubah karena sudah dihapus
        },
        {
          id: "reply-124",
          username: "sitoruszs",
          date: "2025-05-24T01:01:01.001Z",
          content: "Dummy content of reply",
        },
      ],
    };

    // Membuat instance dan membandingkan hasilnya
    const { replies } = new GetReplies(payload);

    expect(replies).toEqual(expected.replies);
  });
});
