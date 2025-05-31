// Mengimpor kelas ThreadUseCase dari folder use_case untuk digunakan di handler ini
const ThreadUseCase = require("../../../../Applications/use_case/ThreadUseCase");

class ThreadHandler {
  // Konstruktor menerima parameter container sebagai dependency injection
  // Container ini bertugas mengelola dan menyediakan instance use case yang dibutuhkan
  constructor(container) {
    this._container = container;

    // Mengikat (bind) method handler ke konteks kelas agar tetap mengenali 'this' saat dipanggil dari luar
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  // Handler untuk route POST /threads, bertugas membuat thread baru
  async postThreadHandler(request, h) {
    // Mengambil instance ThreadUseCase dari container
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);

    // Mendapatkan ID user yang sedang login dari credentials token JWT (autentikasi)
    const { id: owner } = request.auth.credentials;

    // Mempersiapkan data yang akan dikirim ke use case untuk proses pembuatan thread
    const useCasePayload = {
      title: request.payload.title, // judul thread dari body request
      body: request.payload.body, // isi thread dari body request
      owner: owner, // pemilik thread berdasarkan user yang login
    };

    // Menjalankan method addThread pada use case untuk menambahkan thread baru
    // Mengembalikan data thread yang sudah ditambahkan
    const addedThread = await threadUseCase.addThread(useCasePayload);

    // Membuat response dengan status 'success', menyertakan data thread yang baru dibuat
    // Response diberikan kode HTTP 201 (Created)
    return h
      .response({
        status: "success",
        data: {
          addedThread,
        },
      })
      .code(201);
  }

  // Handler untuk route GET /threads/{id}, untuk mendapatkan detail thread berdasarkan id
  async getThreadHandler(request, h) {
    // Mengambil instance ThreadUseCase dari container
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);

    // Mengambil parameter id dari path request sebagai payload use case
    const useCasePayload = request.params.id;

    // Memanggil use case getThread untuk mengambil data thread dari storage
    // Response berisi object thread
    const { thread } = await threadUseCase.getThread(useCasePayload);

    // Mengirim response sukses dengan data thread yang diperoleh
    return h.response({
      status: "success",
      data: {
        thread,
      },
    });
  }
}

// Mengekspor kelas ThreadHandler agar dapat digunakan pada file lain, misalnya untuk routing
module.exports = ThreadHandler;
