// Import modul DomainErrorTranslator yang berfungsi untuk menerjemahkan pesan error domain
const DomainErrorTranslator = require("../DomainErrorTranslator");

// Import modul InvariantError, yaitu kelas error khusus yang merepresentasikan kesalahan validasi atau aturan bisnis yang tidak terpenuhi
const InvariantError = require("../InvariantError");

// Suite utama pengujian untuk DomainErrorTranslator
describe("DomainErrorTranslator", () => {
  // Grup pengujian khusus untuk domain "Users"
  describe("Users Domain", () => {
    // Test case: Memastikan error yang berasal dari domain user diterjemahkan dengan benar menjadi InvariantError dengan pesan yang sesuai
    it("should translate error correctly", () => {
      // Ketika menerima error dengan pesan REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY
      expect(
        DomainErrorTranslator.translate(
          new Error("REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY")
        )
      )
        // Maka harus diterjemahkan menjadi InvariantError dengan pesan penjelasan yang mudah dipahami
        .toStrictEqual(
          new InvariantError(
            "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
          )
        );

      // Ketika menerima error dengan pesan REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION
      expect(
        DomainErrorTranslator.translate(
          new Error("REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION")
        )
      )
        // Maka diterjemahkan ke InvariantError dengan pesan validasi tipe data
        .toStrictEqual(
          new InvariantError(
            "tidak dapat membuat user baru karena tipe data tidak sesuai"
          )
        );

      // Ketika menerima error dengan pesan REGISTER_USER.USERNAME_LIMIT_CHAR
      expect(
        DomainErrorTranslator.translate(
          new Error("REGISTER_USER.USERNAME_LIMIT_CHAR")
        )
      )
        // Maka diterjemahkan ke InvariantError dengan pesan batas karakter username
        .toStrictEqual(
          new InvariantError(
            "tidak dapat membuat user baru karena karakter username melebihi batas limit"
          )
        );

      // Ketika menerima error dengan pesan REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER
      expect(
        DomainErrorTranslator.translate(
          new Error("REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER")
        )
      )
        // Maka diterjemahkan ke InvariantError yang menjelaskan ada karakter terlarang pada username
        .toStrictEqual(
          new InvariantError(
            "tidak dapat membuat user baru karena username mengandung karakter terlarang"
          )
        );
    });
  });

  // Grup pengujian khusus untuk domain "Authentications"
  describe("Authentications Domain", () => {
    // Test case: Memastikan error dari domain autentikasi diterjemahkan sesuai
    it("should translate error correctly", () => {
      // Contoh kasus error ketika properti username dan password tidak dikirim saat login user
      expect(
        DomainErrorTranslator.translate(
          new Error("USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY")
        )
      ).toStrictEqual(
        new InvariantError("harus mengirimkan username dan password")
      );

      // Error saat tipe data username atau password tidak sesuai (bukan string)
      expect(
        DomainErrorTranslator.translate(
          new Error("USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION")
        )
      ).toStrictEqual(new InvariantError("username dan password harus string"));

      // Error saat token refresh tidak dikirim saat proses refresh authentication
      expect(
        DomainErrorTranslator.translate(
          new Error("REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN")
        )
      ).toStrictEqual(new InvariantError("harus mengirimkan token refresh"));

      // Error saat tipe data token refresh tidak sesuai (bukan string)
      expect(
        DomainErrorTranslator.translate(
          new Error(
            "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
          )
        )
      ).toStrictEqual(new InvariantError("refresh token harus string"));

      // Error saat token refresh tidak dikirim saat menghapus autentikasi (logout)
      expect(
        DomainErrorTranslator.translate(
          new Error("DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN")
        )
      ).toStrictEqual(new InvariantError("harus mengirimkan token refresh"));

      // Error saat tipe data token refresh tidak sesuai saat delete authentication
      expect(
        DomainErrorTranslator.translate(
          new Error(
            "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
          )
        )
      ).toStrictEqual(new InvariantError("refresh token harus string"));
    });
  });

  // Grup pengujian khusus untuk domain "Threads"
  describe("Threads Domain", () => {
    // Test case: Pastikan error yang terjadi pada domain thread diterjemahkan dengan benar ke InvariantError
    it("should translate error correctly", () => {
      // Error properti yang dibutuhkan tidak ada saat menambah thread
      expect(
        DomainErrorTranslator.translate(
          new Error("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
        )
      ).toStrictEqual(
        new InvariantError(
          "gagal membuat thread baru, beberapa properti yang dibutuhkan tidak ada"
        )
      );

      // Error tipe data tidak sesuai saat membuat thread baru
      expect(
        DomainErrorTranslator.translate(
          new Error("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
        )
      ).toStrictEqual(
        new InvariantError("gagal membuat thread baru, tipe data tidak sesuai")
      );

      // Error jumlah karakter title thread melebihi batas limit
      expect(
        DomainErrorTranslator.translate(
          new Error("ADD_THREAD.TITLE_LIMIT_CHAR")
        )
      ).toStrictEqual(
        new InvariantError(
          "tidak dapat membuat thread baru karena jumlah karakter pada field title melebihi limit"
        )
      );

      // Variasi error lain terkait domain thread (ADDED_THREAD prefix) untuk properti tidak ada
      expect(
        DomainErrorTranslator.translate(
          new Error("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
        )
      ).toStrictEqual(
        new InvariantError(
          "gagal membuat thread baru, beberapa properti yang dibutuhkan tidak ada"
        )
      );

      // Variasi error tipe data tidak sesuai (ADDED_THREAD prefix)
      expect(
        DomainErrorTranslator.translate(
          new Error("ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
        )
      ).toStrictEqual(
        new InvariantError("gagal membuat thread baru, tipe data tidak sesuai")
      );
    });
  });

  /**
   * Bagian kode untuk domain "Comments" saat ini dikomentari (tidak aktif).
   * Diduga karena alasan pengujian yang belum selesai atau error terkait domain komentar
   * belum ditangani di DomainErrorTranslator.
   * Jika diaktifkan, akan menguji penerjemahan error serupa pada domain komentar.
   */
  // describe("Comments Domain", () => {
  //   it("should translate error correctly", () => {
  //     // contoh pengujian penerjemahan error di domain komentar (tidak aktif)
  //     ...
  //   });
  // });

  // Test case tambahan untuk memastikan bahwa error yang tidak dikenali (tidak perlu diterjemahkan)
  // akan dikembalikan apa adanya tanpa perubahan
  it("should return original error when error message is not needed to translate", () => {
    // Arrange: buat error dengan pesan random yang tidak ada dalam daftar penerjemahan
    const error = new Error("some_error_message");

    // Action: terjemahkan error tersebut menggunakan DomainErrorTranslator
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert: harus mengembalikan error asli, bukan objek error baru atau terjemahan apapun
    expect(translatedError).toStrictEqual(error);
  });
});
