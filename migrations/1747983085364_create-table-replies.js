/* eslint-disable camelcase */
// Menonaktifkan aturan ESLint camelcase karena penamaan kolom menggunakan underscore (_),
// yang umum dalam penamaan kolom database, berbeda dengan camelCase di JavaScript.

exports.up = (pgm) => {
  // Fungsi migrasi "up" ini bertugas membuat tabel baru bernama 'replies' pada database
  // yang akan menyimpan balasan (replies) terhadap komentar dalam sistem forum/thread.

  pgm.createTable("replies", {
    // Membuat tabel 'replies' dengan kolom-kolom berikut:

    id: {
      type: "VARCHAR(50)", // Kolom 'id' bertipe varchar dengan panjang maksimum 50 karakter,
      primaryKey: true, // berfungsi sebagai primary key unik untuk setiap baris balasan
    },
    content: {
      type: "TEXT", // Kolom 'content' bertipe teks, menyimpan isi dari balasan tersebut
      notNull: true, // Kolom ini wajib diisi, tidak boleh kosong
    },
    owner: {
      type: "VARCHAR(50)", // Kolom 'owner' bertipe varchar 50, menyimpan ID user yang membuat balasan
      notNull: true, // Kolom ini wajib diisi
    },
    thread_id: {
      type: "VARCHAR(50)", // Kolom 'thread_id' bertipe varchar 50, menyimpan ID thread tempat balasan dibuat
      notNull: true, // Kolom ini wajib diisi
    },
    comment_id: {
      type: "VARCHAR(50)", // Kolom 'comment_id' bertipe varchar 50, menyimpan ID komentar yang dibalas
      notNull: true, // Kolom ini wajib diisi
    },
    date: {
      type: "TIMESTAMPTZ", // Kolom 'date' bertipe timestamp with timezone, menyimpan waktu balasan dibuat
      notNull: true, // Kolom ini wajib diisi
    },
    deleted_at: {
      type: "TIMESTAMPTZ", // Kolom 'deleted_at' bertipe timestamp with timezone,
      notNull: false, // nullable, menandai waktu balasan dihapus secara soft delete (NULL jika belum dihapus)
    },
  });

  // Menambahkan constraint foreign key agar kolom 'owner' hanya boleh berisi nilai yang ada di tabel 'users'
  pgm.addConstraint(
    "replies", // Tabel tujuan constraint
    "fk_replies.owner_users.id", // Nama constraint: foreign key 'owner' di tabel replies ke kolom id di tabel users
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
    // Jika user dihapus dari tabel 'users', maka seluruh balasan yang dibuat user tersebut otomatis ikut terhapus (cascade)
  );

  // Menambahkan constraint foreign key agar kolom 'thread_id' mengacu ke ID thread yang valid di tabel 'threads'
  pgm.addConstraint(
    "replies",
    "fk_replies.thread_id_threads.id", // Nama constraint
    "FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE"
    // Jika thread dihapus, maka semua balasan yang terkait dengan thread tersebut ikut terhapus otomatis
  );

  // Menambahkan constraint foreign key agar kolom 'comment_id' mengacu ke ID komentar yang valid di tabel 'comments'
  pgm.addConstraint(
    "replies",
    "fk_replies.comment_id_comments.id", // Nama constraint
    "FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE"
    // Jika komentar dihapus, maka semua balasan yang terkait dengan komentar tersebut ikut terhapus otomatis
  );
};

exports.down = (pgm) => {
  // Fungsi migrasi "down" untuk rollback migrasi,
  // menghapus tabel 'replies' dan seluruh data serta constraint terkait

  pgm.dropTable("replies");
  // Menghapus tabel 'replies' dari database
};
