/* eslint-disable camelcase */
// Menonaktifkan aturan ESLint camelcase untuk file ini karena penamaan kolom menggunakan underscore (_),
// yang umum dipakai dalam penamaan database, bukan camelCase.

exports.up = (pgm) => {
  // Fungsi migrasi "up" yang akan dijalankan saat migrasi diterapkan ke database.
  // Parameter 'pgm' adalah objek migrasi dari node-pg-migrate yang menyediakan method untuk memanipulasi skema DB.

  pgm.createTable("authentications", {
    // Membuat tabel baru bernama 'authentications' dengan definisi kolom berikut:

    token: {
      type: "TEXT", // Tipe data kolom token adalah TEXT, cocok untuk menyimpan string token yang panjangnya variatif.
      notNull: true, // Kolom token wajib diisi (tidak boleh null), karena token adalah data penting untuk autentikasi.
    },
  });
  // Tabel ini digunakan untuk menyimpan token autentikasi yang valid, biasanya untuk session management atau token JWT yang sudah diterbitkan.
};

exports.down = (pgm) => {
  // Fungsi migrasi "down" yang dijalankan saat rollback migrasi,
  // bertujuan menghapus tabel 'authentications' dan membatalkan perubahan yang dilakukan oleh fungsi 'up'.

  pgm.dropTable("authentications");
  // Menghapus tabel 'authentications' dari database,
  // artinya semua token yang tersimpan di tabel ini akan hilang saat rollback dilakukan.
};
