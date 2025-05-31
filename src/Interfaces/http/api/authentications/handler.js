// Mengimpor use case yang dibutuhkan untuk login, refresh token, dan logout
const LoginUserUseCase = require("../../../../Applications/use_case/LoginUserUseCase");
const RefreshAuthenticationUseCase = require("../../../../Applications/use_case/RefreshAuthenticationUseCase");
const LogoutUserUseCase = require("../../../../Applications/use_case/LogoutUserUseCase");

// Mendefinisikan class AuthenticationsHandler yang bertanggung jawab menangani request terkait autentikasi
class AuthenticationsHandler {
  constructor(container) {
    // Dependency Injection container yang berisi semua instance use case
    this._container = container;

    // Mengikat konteks `this` pada method ke instance class agar tetap konsisten saat dipanggil
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  // Handler untuk route POST /authentications (login user)
  async postAuthenticationHandler(request, h) {
    // Mengambil instance LoginUserUseCase dari container
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);

    // Menjalankan use case login dengan payload dari request (biasanya username dan password)
    const { accessToken, refreshToken } = await loginUserUseCase.execute(
      request.payload
    );

    // Menyusun dan mengembalikan response HTTP 201 dengan data token yang diperoleh
    const response = h.response({
      status: "success",
      data: {
        accessToken, // Token akses untuk digunakan dalam setiap permintaan selanjutnya
        refreshToken, // Token refresh untuk memperbarui token akses saat sudah kedaluwarsa
      },
    });
    response.code(201); // Mengatur kode HTTP menjadi 201 Created
    return response;
  }

  // Handler untuk route PUT /authentications (refresh token)
  async putAuthenticationHandler(request) {
    // Mengambil instance RefreshAuthenticationUseCase dari container
    const refreshAuthenticationUseCase = this._container.getInstance(
      RefreshAuthenticationUseCase.name
    );

    // Menjalankan use case untuk memperbarui access token berdasarkan refresh token dari request payload
    const accessToken = await refreshAuthenticationUseCase.execute(
      request.payload
    );

    // Mengembalikan token baru sebagai respons dengan status sukses
    return {
      status: "success",
      data: {
        accessToken, // Token akses baru yang dikembalikan ke user
      },
    };
  }

  // Handler untuk route DELETE /authentications (logout user)
  async deleteAuthenticationHandler(request) {
    // Mengambil instance LogoutUserUseCase dari container
    const logoutUserUseCase = this._container.getInstance(
      LogoutUserUseCase.name
    );

    // Menjalankan use case logout yang menghapus atau menonaktifkan refresh token
    await logoutUserUseCase.execute(request.payload);

    // Mengembalikan respons sukses setelah logout berhasil
    return {
      status: "success",
    };
  }
}

// Mengekspor class agar dapat digunakan di file lain, biasanya di routing atau server configuration
module.exports = AuthenticationsHandler;
