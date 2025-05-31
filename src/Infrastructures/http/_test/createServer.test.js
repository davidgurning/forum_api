// Import fungsi createServer dari file createServer.js yang bertugas untuk membuat instance server HTTP
const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const injections = require("../../injections");
const createServer = require("../createServer");

// Describe adalah fungsi dari Jest yang digunakan untuk mengelompokkan beberapa test case
describe("HTTP server", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });
  // Test case pertama: Menguji apakah server merespon dengan status 404 untuk route yang tidak terdaftar
  it("should response 404 when request unregistered route", async () => {
    // Arrange: Persiapkan server dengan memanggil createServer,
    // createServer mengembalikan instance server Hapi yang sudah siap menerima request
    const server = await createServer({});

    // Action: Melakukan simulasi request HTTP GET ke route yang tidak ada (unregisteredRoute)
    // server.inject digunakan untuk melakukan request internal tanpa harus menjalankan server secara nyata
    const response = await server.inject({
      method: "GET", // Metode HTTP yang dipakai pada request ini adalah GET
      url: "/unregisteredRoute", // Endpoint yang tidak terdaftar di server
    });

    // Assert: Memastikan bahwa response dari server memiliki status code 404 (Not Found)
    // Ini menunjukkan server mengenali bahwa route tersebut tidak ada
    expect(response.statusCode).toEqual(404);
  });

  describe("when GET /", () => {
    it("should return 200 and hello world", async () => {
      // Arrange
      const server = await createServer({});
      // Action
      const response = await server.inject({
        method: "GET",
        url: "/",
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.value).toEqual("Hello world!");
    });
  });

  // Test case kedua: Menguji bagaimana server menangani error internal (server error)
  it("should handle server error correctly", async () => {
    // Arrange:
    // Membuat payload yang biasanya dipakai untuk membuat user baru,
    // isinya username, fullname, dan password
    const requestPayload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
      password: "super_secret",
    };

    // Membuat instance server yang di-inject dependencies kosong (fake injection)
    // Jadi ini bukan instance server yang fully functional,
    // mungkin untuk memicu error internal secara sengaja
    const server = await createServer({});

    // Action:
    // Simulasi request POST ke endpoint /users dengan payload di atas
    // Biasanya endpoint ini dipakai untuk membuat user baru
    const response = await server.inject({
      method: "POST", // Metode HTTP POST karena ingin mengirim data
      url: "/users", // Endpoint untuk menambah user baru
      payload: requestPayload, // Data yang dikirim sebagai isi request body
    });

    // Assert:
    // Mengubah response.payload yang berupa string JSON menjadi objek JavaScript
    const responseJson = JSON.parse(response.payload);

    // Memastikan response memiliki status code 500 (Internal Server Error)
    expect(response.statusCode).toEqual(500);

    // Memastikan response JSON memiliki properti status dengan nilai 'error'
    expect(responseJson.status).toEqual("error");

    // Memastikan pesan error sesuai dengan yang diharapkan (pesan dalam bahasa Indonesia)
    expect(responseJson.message).toEqual("terjadi kegagalan pada server kami");
  });
});
