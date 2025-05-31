const ThreadRepository = require("../ThreadRepository");

// Describe block menjelaskan bahwa ini adalah kumpulan pengujian untuk interface ThreadRepository
describe("ThreadRepository interface", () => {
  // Test case: memastikan bahwa memanggil method-method abstrak akan melempar error yang sesuai
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    // Membuat instance dari kelas ThreadRepository yang merupakan kelas abstrak/interface
    // Kelas ini seharusnya tidak mengimplementasikan behavior nyata, hanya mendefinisikan method yang wajib diimplementasi
    const threadRepository = new ThreadRepository();

    // Action and Assert
    // Memastikan bahwa memanggil method addThread tanpa implementasi akan melempar error yang spesifik
    // Karena method ini bersifat abstrak, jika tidak diimplementasikan harus melempar error 'METHOD_NOT_IMPLEMENTED'
    await expect(threadRepository.addThread({})).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    // Memastikan bahwa memanggil method checkAvailabilityThread tanpa implementasi juga melempar error yang sama
    await expect(
      threadRepository.checkAvailabilityThread({})
    ).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    // Memastikan bahwa memanggil method getThread tanpa implementasi juga melempar error yang sama
    await expect(threadRepository.getThread({})).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
