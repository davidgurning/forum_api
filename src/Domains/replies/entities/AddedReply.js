// Mendeklarasikan class bernama AddedReply
class AddedReply {
  // Konstruktor akan dipanggil ketika objek baru dari AddedReply dibuat
  constructor(payload) {
    // Memanggil fungsi privat untuk memverifikasi apakah payload valid
    this._verifyPayload(payload);

    // Mengambil nilai id, content, dan owner dari payload menggunakan destructuring
    const { id, content, owner } = payload;

    // Menetapkan nilai-nilai ke properti instance objek AddedReply
    this.id = id; // ID unik dari reply, misalnya "reply-123"
    this.content = content; // Isi teks dari reply
    this.owner = owner; // ID atau username pemilik reply
  }

  // Fungsi privat (konvensi dengan underscore) untuk memverifikasi validitas payload
  _verifyPayload({ id, content, owner }) {
    // Validasi: pastikan ketiga properti wajib tersedia (tidak null, undefined, atau kosong)
    if (!id || !content || !owner) {
      // Jika salah satu tidak ada, lempar error khusus
      throw new Error("ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    // Validasi: pastikan semua nilai bertipe string
    if (
      typeof id !== "string" || // id harus berupa string
      typeof content !== "string" || // content juga string
      typeof owner !== "string" // owner harus string
    ) {
      // Jika ada tipe data yang tidak sesuai, lempar error lain
      throw new Error("ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

// Mengekspor class agar bisa digunakan di file JavaScript lain
module.exports = AddedReply;
