/* eslint-disable camelcase */
// Menonaktifkan aturan ESLint camelcase karena penamaan kolom menggunakan underscore (_)
// yang umum dipakai dalam database, berbeda dengan camelCase di JavaScript.

exports.up = (pgm) => {
  // Fungsi migrasi "up" untuk membuat/memperbarui skema database saat migrasi dijalankan

  pgm.createTable("threads", {
    // Membuat tabel baru dengan nama 'threads' dengan kolom-kolom berikut:

    id: {
      type: "VARCHAR(50)", // Kolom 'id' bertipe string dengan panjang maksimal 50 karakter
      primaryKey: true, // Menandai kolom ini sebagai primary key, unik dan tidak boleh null
    },
    title: {
      type: "TEXT", // Kolom 'title' bertipe teks (panjang bisa variatif)
      notNull: true, // Kolom ini wajib diisi, tidak boleh null
    },
    body: {
      type: "TEXT", // Kolom 'body' bertipe teks, berisi isi atau konten thread
      notNull: true, // Kolom ini wajib diisi
    },
    owner: {
      type: "VARCHAR(50)", // Kolom 'owner' bertipe string max 50 karakter, menyimpan id user pemilik thread
      notNull: true, // Kolom ini wajib diisi
    },
    date: {
      type: "TIMESTAMPTZ", // Kolom 'date' bertipe timestamp with time zone, untuk menyimpan waktu pembuatan thread
      notNull: true, // Kolom ini wajib diisi (tanggal thread dibuat harus ada)
    },
  });

  pgm.addConstraint(
    "threads", // Nama tabel yang akan ditambahkan constraint (batasan aturan)
    "fk_threads.owner_users.id", // Nama constraint, biasanya dengan format fk_<tabel>.<kolom>_<referensi>
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
    // Mendefinisikan foreign key pada kolom 'owner' yang mereferensikan kolom 'id' di tabel 'users'
    // ON DELETE CASCADE artinya jika user terkait dihapus, maka semua thread milik user itu juga akan otomatis terhapus.
  );
};

exports.down = (pgm) => {
  // Fungsi migrasi "down" untuk rollback migrasi, menghapus tabel threads jika migrasi dibatalkan

  pgm.dropTable("threads");
  // Menghapus tabel 'threads' beserta seluruh data dan constraint-nya
};
