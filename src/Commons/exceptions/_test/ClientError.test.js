// Import kelas ClientError dari file ../ClientError
const ClientError = require("../ClientError");

/**
 * Suite pengujian untuk kelas ClientError.
 * Fokus pengujian ini adalah memastikan bahwa kelas ClientError
 * berperilaku sebagai kelas abstrak dan tidak dapat diinstansiasi secara langsung.
 */
describe("ClientError", () => {
  /**
   * Test case: Mencoba membuat instance langsung dari ClientError
   * Diharapkan pembuatan instance langsung ini akan menghasilkan error,
   * dengan pesan 'cannot instantiate abstract class'.
   *
   * Hal ini menandakan bahwa ClientError memang didesain sebagai kelas abstrak,
   * yang hanya boleh digunakan sebagai kelas induk (parent class) untuk
   * kelas error kustom yang lebih spesifik, dan tidak boleh dibuat instancenya sendiri.
   */
  it("should throw error when directly use it", () => {
    // Mengecek bahwa ketika membuat instance ClientError secara langsung,
    // fungsi constructor akan melemparkan error dengan pesan tertentu
    expect(() => new ClientError("")).toThrowError(
      "cannot instantiate abstract class"
    );
  });
});
