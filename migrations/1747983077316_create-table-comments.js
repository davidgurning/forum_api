/* eslint-disable camelcase */
// Menonaktifkan aturan ESLint camelcase karena penamaan kolom menggunakan underscore (_),
// yang umum dalam penamaan kolom database, berbeda dengan camelCase di JavaScript.

exports.up = (pgm) => {
  // Fungsi migrasi "up" digunakan untuk membuat atau memperbarui skema database saat migrasi dijalankan

  pgm.createTable("comments", {
    // Membuat tabel baru bernama 'comments' dengan kolom-kolom berikut:

    id: {
      type: "VARCHAR(50)", // Kolom 'id' bertipe string (varchar) dengan maksimal 50 karakter
      primaryKey: true, // Kolom ini menjadi primary key, artinya unik dan tidak boleh kosong (NOT NULL implisit)
    },
    content: {
      type: "TEXT", // Kolom 'content' bertipe teks, untuk menyimpan isi komentar
      notNull: true, // Kolom ini wajib diisi, tidak boleh NULL
    },
    owner: {
      type: "VARCHAR(50)", // Kolom 'owner' bertipe string 50 karakter, menyimpan ID user yang membuat komentar
      notNull: true, // Kolom ini wajib diisi
    },
    thread_id: {
      type: "VARCHAR(50)", // Kolom 'thread_id' bertipe string 50 karakter, menyimpan ID thread yang dikomentari
      notNull: true, // Kolom ini wajib diisi
    },
    date: {
      type: "TIMESTAMPTZ", // Kolom 'date' bertipe timestamp with time zone, untuk menyimpan waktu pembuatan komentar
      notNull: true, // Kolom ini wajib diisi
    },
    deleted_at: {
      type: "TIMESTAMPTZ", // Kolom 'deleted_at' bertipe timestamp with time zone, untuk menandai waktu komentar dihapus (soft delete)
      notNull: false, // Kolom ini boleh NULL, menandakan komentar belum dihapus jika NULL
    },
  });

  pgm.addConstraint(
    "comments", // Nama tabel yang akan ditambahkan constraint
    "fk_comments.owner_users.id", // Nama constraint: foreign key dari kolom owner di comments ke id di users
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
    // Mendefinisikan foreign key pada kolom 'owner' yang merujuk ke kolom 'id' tabel 'users'
    // ON DELETE CASCADE berarti jika user yang dimaksud dihapus, maka semua komentar milik user ini juga otomatis terhapus
  );

  pgm.addConstraint(
    "comments", // Nama tabel yang akan ditambahkan constraint
    "fk_comments.thread_id_threads.id", // Nama constraint: foreign key dari kolom thread_id di comments ke id di threads
    "FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE"
    // Mendefinisikan foreign key pada kolom 'thread_id' yang merujuk ke kolom 'id' tabel 'threads'
    // ON DELETE CASCADE berarti jika thread dihapus, semua komentar terkait thread itu juga akan otomatis terhapus
  );
};

exports.down = (pgm) => {
  // Fungsi migrasi "down" untuk rollback migrasi,
  // menghapus tabel comments dan seluruh data serta constraint terkait

  pgm.dropTable("comments");
  // Menghapus tabel 'comments' dari database
};
