// Import kelas error kustom AuthenticationError dan kelas error dasar ClientError
const AuthenticationError = require("../AuthenticationError");
const ClientError = require("../ClientError");

/**
 * Suite pengujian untuk kelas AuthenticationError.
 * Tujuannya adalah memastikan bahwa AuthenticationError dapat dibuat dengan benar
 * dan memenuhi sifat-sifat yang diharapkan dari error tersebut.
 */
describe("AuthenticationError", () => {
  /**
   * Test case: Membuat instance AuthenticationError dengan pesan error tertentu
   * dan memverifikasi bahwa:
   * 1. Instance yang dibuat adalah turunan dari kelas AuthenticationError itu sendiri.
   * 2. Instance tersebut juga merupakan turunan dari ClientError, karena AuthenticationError
   *    merupakan subclass dari ClientError (error spesifik jenis client error).
   * 3. Instance tersebut juga merupakan turunan dari Error, kelas dasar error di JavaScript.
   * 4. Properti statusCode pada objek error berisi kode HTTP 401 (Unauthorized),
   *    sesuai standar untuk error autentikasi.
   * 5. Properti message pada objek error berisi string pesan yang diberikan saat instansiasi.
   * 6. Properti name pada objek error adalah 'AuthenticationError', yang membantu identifikasi tipe error.
   */
  it("should create AuthenticationError correctly", () => {
    // Membuat objek error AuthenticationError dengan pesan 'authentication error!'
    const authenticationError = new AuthenticationError(
      "authentication error!"
    );

    // Memastikan objek yang dibuat merupakan instance dari AuthenticationError
    expect(authenticationError).toBeInstanceOf(AuthenticationError);
    // Memastikan objek tersebut juga instance dari ClientError (kelas induknya)
    expect(authenticationError).toBeInstanceOf(ClientError);
    // Memastikan objek tersebut juga instance dari Error (kelas dasar JS)
    expect(authenticationError).toBeInstanceOf(Error);

    // Memastikan statusCode error sesuai kode HTTP untuk autentikasi gagal
    expect(authenticationError.statusCode).toEqual(401);

    // Memastikan pesan error sesuai pesan yang diberikan saat pembuatan
    expect(authenticationError.message).toEqual("authentication error!");

    // Memastikan nama error sesuai dengan kelasnya, memudahkan identifikasi error
    expect(authenticationError.name).toEqual("AuthenticationError");
  });
});
