// Mengimpor class ClientError dari file '../ClientError'
// ClientError kemungkinan adalah kelas error dasar untuk error yang terjadi karena kesalahan dari client (HTTP 4xx)
const ClientError = require("../ClientError");

// Mengimpor class InvariantError dari file '../InvariantError'
// InvariantError adalah kelas error khusus yang kemungkinan mewarisi ClientError dan digunakan untuk validasi invariant yang gagal
const InvariantError = require("../InvariantError");

// Mendefinisikan sebuah suite test dengan nama 'InvariantError'
// Suite ini berisi serangkaian pengujian yang bertujuan memastikan bahwa class InvariantError berfungsi dengan benar
describe("InvariantError", () => {
  // Mendefinisikan sebuah test case dengan deskripsi 'should create an error correctly'
  // Test ini bertujuan memastikan bahwa objek InvariantError dibuat dengan benar
  it("should create an error correctly", () => {
    // Membuat instance baru dari InvariantError dengan pesan error 'an error occurs'
    const invariantError = new InvariantError("an error occurs");

    // Mengecek bahwa objek yang dibuat merupakan instance dari InvariantError
    // Ini memastikan bahwa objek memang berasal dari kelas yang diharapkan
    expect(invariantError).toBeInstanceOf(InvariantError);

    // Mengecek bahwa objek juga merupakan instance dari ClientError
    // Ini memastikan pewarisan kelas InvariantError dari ClientError berjalan dengan baik
    expect(invariantError).toBeInstanceOf(ClientError);

    // Mengecek bahwa objek merupakan instance dari kelas Error bawaan JavaScript
    // Karena ClientError dan InvariantError seharusnya juga mewarisi Error, ini memastikan rantai pewarisan lengkap
    expect(invariantError).toBeInstanceOf(Error);

    // Mengecek bahwa properti statusCode pada objek memiliki nilai 400
    // Ini penting karena InvariantError harus mengindikasikan status HTTP 400 (Bad Request)
    expect(invariantError.statusCode).toEqual(400);

    // Mengecek bahwa properti message pada objek berisi pesan error yang diberikan saat pembuatan objek
    expect(invariantError.message).toEqual("an error occurs");

    // Mengecek bahwa properti name pada objek adalah string 'InvariantError'
    // Properti ini biasanya digunakan untuk mengidentifikasi jenis error secara eksplisit
    expect(invariantError.name).toEqual("InvariantError");
  });
});
