const GetComments = require("../GetComments");

describe("a GetComments entities", () => {
  // Test ini memastikan jika payload yang diberikan tidak memiliki properti 'comments',
  // maka konstruktor GetComments harus melempar error dengan pesan yang sesuai.
  it("should throw error when payload did not contain needed property", () => {
    // Payload hanya berisi array comments dengan satu komentar,
    // tapi properti 'comments' secara eksplisit dianggap tidak lengkap karena mungkin ada properti lain yang dibutuhkan dalam implementasi GetComments
    const payload = {
      comments: [
        {
          id: "comment-123",
          username: "dicoding",
          date: "2025-05-23 01:01:01.001Z",
          content: "Dummy content of comment",
        },
      ],
    };

    // Mengharapkan pembuatan objek GetComments dengan payload ini gagal dan melempar error
    expect(() => new GetComments(payload)).toThrowError(
      "GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  // Test ini memeriksa jika tipe data pada payload tidak sesuai spesifikasi,
  // maka GetComments harus melempar error yang jelas.
  it("should throw error when payload did not meet data type specification", () => {
    // payload pertama, comments bukan array tapi objek (salah tipe)
    const payload = {
      comments: {},
    };

    // payload kedua, dalam array comments, tipe username salah (angka bukan string)
    const payload2 = {
      comments: [
        {
          id: "comment-123",
          username: 1234, // tipe data salah
          date: "2025-05-23 01:01:01.001Z",
          content: "Dummy content of comment",
          deletedAt: null,
        },
      ],
    };

    // payload ketiga, dalam array comments, tipe deletedAt salah (angka, harusnya string atau null)
    const payload3 = {
      comments: [
        {
          id: "comment-123",
          username: "dicoding-123",
          date: "2025-05-23 01:01:01.001Z",
          content: "Dummy content of comment",
          deletedAt: 123, // tipe data salah
        },
      ],
    };

    // Pastikan error dilempar saat tipe data tidak sesuai
    expect(() => new GetComments(payload)).toThrowError(
      "GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new GetComments(payload2)).toThrowError(
      "GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
    expect(() => new GetComments(payload3)).toThrowError(
      "GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  // Test ini memeriksa fungsi pemetaan ulang data komentar (remapping),
  // khususnya bagaimana komentar yang sudah dihapus (deletedAt !== null) ditangani
  it("should remap comments data correctly", () => {
    const payload = {
      comments: [
        {
          id: "comment-123",
          username: "dicoding",
          date: "2025-05-23 01:01:01.001Z",
          content: "Dummy content of comment",
          deletedAt: null, // komentar masih aktif
        },
        {
          id: "comment-124",
          username: "dicoding",
          date: "2025-05-23 01:01:01.001Z",
          content: "Dummy content of comment",
          deletedAt: "2025-05-24 01:01:01.001Z", // komentar dihapus
        },
      ],
    };

    // Membuat objek GetComments dari payload
    const { comments } = new GetComments(payload);

    // Data komentar yang diharapkan:
    // - Komentar pertama tetap seperti aslinya (karena belum dihapus)
    // - Komentar kedua content diganti menjadi "**komentar telah dihapus**" sebagai tanda komentar sudah dihapus
    const expectedComment = [
      {
        id: "comment-123",
        username: "dicoding",
        date: "2025-05-23 01:01:01.001Z",
        content: "Dummy content of comment",
      },
      {
        id: "comment-124",
        username: "dicoding",
        date: "2025-05-23 01:01:01.001Z",
        content: "**komentar telah dihapus**",
      },
    ];

    // Memastikan hasil remapping sesuai dengan yang diharapkan
    expect(comments).toEqual(expectedComment);
  });

  // Test ini menguji pembuatan objek GetComments dengan payload valid,
  // sekaligus memeriksa apakah property comments berisi array komentar dengan mapping yang benar
  it("should create GetComments object correctly", () => {
    const payload = {
      comments: [
        {
          id: "comment-123",
          username: "dicoding",
          date: "2025-05-23 01:01:01.001Z",
          content: "some reply a comment",
          deletedAt: null,
        },
        {
          id: "comment-124",
          username: "dicoding",
          date: "2025-05-23 01:01:01.001Z",
          content: "some reply a comment",
          deletedAt: "2025-05-24 01:01:01.001Z",
        },
      ],
    };

    // Expected result, sama dengan test sebelumnya:
    // komentar dengan deletedAt non-null harus menampilkan content sebagai "**komentar telah dihapus**"
    const expected = {
      comments: [
        {
          id: "comment-123",
          username: "dicoding",
          date: "2025-05-23 01:01:01.001Z",
          content: "some reply a comment",
        },
        {
          id: "comment-124",
          username: "dicoding",
          date: "2025-05-23 01:01:01.001Z",
          content: "**komentar telah dihapus**",
        },
      ],
    };

    // Membuat objek GetComments dengan payload valid
    const { comments } = new GetComments(payload);

    // Pastikan hasilnya sama dengan expected (mapping data komentar berjalan benar)
    expect(comments).toEqual(expected.comments);
  });
});
