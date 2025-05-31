/* eslint-disable camelcase */
// Menonaktifkan aturan ESLint camelcase untuk file ini karena nama properti tabel menggunakan underscore (_)
// agar sesuai dengan konvensi penamaan database yang umum, bukan camelCase.

exports.up = (pgm) => {
  // Fungsi migrasi "up" yang akan dijalankan saat migrasi diterapkan.
  // Fungsi ini menerima objek 'pgm' (Postgres Migration) yang berisi method-method untuk mengubah skema database.

  pgm.createTable("users", {
    // Membuat tabel baru bernama 'users' dengan kolom-kolom sebagai berikut:

    id: {
      type: "VARCHAR(50)", // Tipe data kolom id adalah string dengan panjang maksimum 50 karakter.
      primaryKey: true, // Menandai kolom ini sebagai primary key tabel, sehingga harus unik dan tidak boleh null.
    },

    username: {
      type: "VARCHAR(50)", // Tipe data string dengan maksimum 50 karakter untuk username.
      notNull: true, // Kolom ini wajib diisi (tidak boleh null).
      unique: true, // Nilai dalam kolom ini harus unik di seluruh tabel, mencegah duplikasi username.
    },

    password: {
      type: "TEXT", // Tipe data teks untuk menyimpan password (biasanya dalam bentuk hash).
      notNull: true, // Password wajib diisi, tidak boleh null.
    },

    fullname: {
      type: "TEXT", // Tipe data teks untuk menyimpan nama lengkap user.
      notNull: true, // Nama lengkap wajib diisi, tidak boleh null.
    },
  });
};

exports.down = (pgm) => {
  // Fungsi migrasi "down" yang dijalankan saat rollback migrasi (mengembalikan perubahan migrasi "up").
  // Biasanya digunakan untuk menghapus tabel atau perubahan lain yang dibuat dalam fungsi "up".

  pgm.dropTable("users");
  // Menghapus tabel 'users' dari database, menghilangkan seluruh data dan skema yang berkaitan dengan tabel ini.
};
