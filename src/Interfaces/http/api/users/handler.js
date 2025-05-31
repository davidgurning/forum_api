// Mengimpor kelas AddUserUseCase dari folder use_case
// Kelas ini berisi logika bisnis untuk menambahkan user baru ke sistem
const AddUserUseCase = require("../../../../Applications/use_case/AddUserUseCase");

class UsersHandler {
  // Konstruktor kelas menerima parameter container yang berfungsi sebagai dependency injection container
  // Container ini akan digunakan untuk mendapatkan instance use case yang dibutuhkan
  constructor(container) {
    this._container = container;

    // Mengikat (bind) method postUserHandler ke konteks class ini agar saat dipanggil dari luar, konteks this tetap benar
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  // Method async yang menangani request HTTP POST untuk menambahkan user baru
  // Parameter:
  // - request: berisi informasi dari request yang masuk, termasuk payload data user baru
  // - h: toolkit dari Hapi.js untuk membuat response
  async postUserHandler(request, h) {
    // Mengambil instance dari AddUserUseCase melalui container dependency injection
    // Dengan ini handler tidak perlu tahu bagaimana use case dibuat, cukup minta dari container
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);

    // Menjalankan use case execute dengan membawa data payload dari request (biasanya data user baru)
    // Fungsi execute akan memproses penambahan user dan mengembalikan data user yang sudah ditambahkan
    const addedUser = await addUserUseCase.execute(request.payload);

    // Membuat response sukses menggunakan toolkit h.response dari Hapi.js
    // Mengemas status dan data addedUser dalam body response
    const response = h.response({
      status: "success",
      data: {
        addedUser,
      },
    });

    // Mengatur status HTTP response menjadi 201 Created
    response.code(201);

    // Mengembalikan response yang sudah disiapkan ke client
    return response;
  }
}

// Mengekspor kelas UsersHandler agar bisa digunakan oleh modul lain, misalnya untuk pendaftaran route
module.exports = UsersHandler;
