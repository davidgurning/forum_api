const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository Interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Membuat instance dari ReplyRepository yang merupakan kelas abstrak/interface.
    // Karena ReplyRepository method-nya belum diimplementasikan, setiap pemanggilan method harus melempar error.
    const replyRepository = new ReplyRepository();

    // Memastikan bahwa saat memanggil addReply dengan argumen kosong, akan melempar error
    // yang bertuliskan "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    await expect(replyRepository.addReply({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    // Memastikan checkAvailabilityReply juga melempar error yang sama saat dipanggil dengan argumen kosong.
    await expect(
      replyRepository.checkAvailabilityReply({})
    ).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    // Memastikan verifyReplyOwner juga melempar error yang sama saat dipanggil dengan argumen kosong.
    await expect(replyRepository.verifyReplyOwner({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    // Memastikan deleteReply melempar error yang sama saat dipanggil.
    await expect(replyRepository.deleteReply({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    // Memastikan getReplies juga melempar error yang sama saat dipanggil dengan argumen string kosong.
    await expect(replyRepository.getReplies("")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
