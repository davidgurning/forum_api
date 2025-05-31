// Mengimpor class NotFoundError dari file '../NotFoundError'
// NotFoundError adalah kelas error khusus yang digunakan untuk menandakan bahwa resource yang dicari tidak ditemukan
const NotFoundError = require("../NotFoundError");

// Mengimpor class ClientError dari file '../ClientError'
// ClientError adalah kelas dasar error untuk client-side error (biasanya HTTP status code 4xx)
const ClientError = require("../ClientError");

// Mendefinisikan test suite dengan nama 'NotFoundError'
// Test suite ini akan berisi serangkaian test untuk memastikan NotFoundError berfungsi dengan benar
describe("NotFoundError", () => {
  // Mendefinisikan test case dengan deskripsi 'should create error correctly'
  // Test ini bertujuan memastikan bahwa objek NotFoundError dapat dibuat dengan benar dan sesuai ekspektasi
  it("should create error correctly", () => {
    // Membuat instance baru dari NotFoundError dengan pesan 'not found!'
    const notFoundError = new NotFoundError("not found!");

    // Memastikan objek yang dibuat merupakan instance dari NotFoundError
    // Ini memastikan objek tersebut benar berasal dari kelas yang diharapkan
    expect(notFoundError).toBeInstanceOf(NotFoundError);

    // Memastikan objek juga merupakan instance dari ClientError
    // Ini memastikan NotFoundError mewarisi ClientError dengan benar
    expect(notFoundError).toBeInstanceOf(ClientError);

    // Memastikan objek juga merupakan instance dari Error bawaan JavaScript
    // Ini penting agar error ini bisa berperilaku seperti error standar di JS
    expect(notFoundError).toBeInstanceOf(Error);

    // Memastikan pesan error pada objek sesuai dengan pesan yang diberikan saat pembuatan objek
    expect(notFoundError.message).toEqual("not found!");

    // Memastikan properti statusCode pada objek adalah 404
    // Kode status 404 menandakan resource tidak ditemukan, jadi harus tepat di sini
    expect(notFoundError.statusCode).toEqual(404);

    // Memastikan nama error adalah 'NotFoundError'
    // Properti ini sering dipakai untuk identifikasi jenis error dalam debugging atau logging
    expect(notFoundError.name).toEqual("NotFoundError");
  });
});
