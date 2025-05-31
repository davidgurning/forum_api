/* eslint-disable no-unused-vars */
// Mendefinisikan kelas ThreadRepository yang berfungsi sebagai interface atau kelas abstrak
// Kelas ini bertujuan sebagai kontrak (blueprint) untuk implementasi repository thread yang sesungguhnya
class ThreadRepository {
  // Method abstrak async untuk menambahkan thread baru ke dalam penyimpanan data
  // Parameter addThread biasanya berupa objek yang berisi data thread yang ingin ditambahkan
  // Karena ini method abstrak, secara default method ini melempar error jika dipanggil langsung tanpa implementasi
  async addThread(addThread) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Method abstrak async untuk mengecek ketersediaan thread berdasarkan threadId
  // Parameter threadId adalah identifikasi unik thread yang akan dicek
  // Jika method ini dipanggil langsung tanpa implementasi, melempar error
  async checkAvailabilityThread(threadId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Method abstrak async untuk mengambil data thread berdasarkan threadId
  // Mengembalikan detail thread sesuai dengan threadId yang diberikan
  // Melempar error jika dipanggil langsung tanpa implementasi pada kelas turunan
  async getThread(threadId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

// Mengekspor kelas ThreadRepository agar bisa digunakan di file lain
module.exports = ThreadRepository;
