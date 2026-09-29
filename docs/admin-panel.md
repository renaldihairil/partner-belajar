# Admin panel Partner Belajar

Admin panel ada di **`/admin`** (mis. `https://partnerbelajar.vercel.app/admin`).
Yang bisa dikelola:

| Menu | Isi |
| --- | --- |
| Program & Jadwal | Info program, gambar, kurikulum, hasil belajar, "cocok untuk", paket harga, jadwal kelas (tanggal, hari, jam, mode, kuota, jumlah terdaftar, tutup manual) |
| Pengajar | Profil, foto, program yang diajar, keunggulan, tampil/sembunyi, urutan |
| Testimoni | Isi, rating, program, kota, tanggal, tampil/sembunyi, urutan |
| Artikel | Judul, ringkasan, isi (blok paragraf/subjudul/daftar/tips), gambar sampul, kategori, tag, penulis, tanggal terbit, draf/terbit, artikel pilihan |
| Akun Admin | Ganti password; (Pemilik) tambah/ubah/hapus admin, atur peran & menu yang boleh diakses |

## Peran & hak akses

| Peran | Akses |
| --- | --- |
| **Pemilik** | Semua menu + mengelola akun admin lain. Akun admin yang sudah ada otomatis menjadi Pemilik. |
| **Editor** | Hanya menu yang dicentang: Program & Jadwal, Pengajar, Testimoni, Artikel. Menu lain tidak tampil dan alamatnya dialihkan ke dashboard. |

Aturan: harus ada minimal satu Pemilik; peran akun sendiri tidak bisa diubah; perubahan hak akses berlaku segera.
Pengecekan dilakukan di server (halaman dan aksi simpan/hapus/unggah), bukan hanya menyembunyikan menu.

Setiap perubahan yang disimpan **langsung tampil di situs** (halaman publik diperbarui otomatis).

## Setup di Vercel (sekali saja)

1. **Database:** Vercel → proyek `partner-belajar` → **Storage** → **Neon** → **Create** →
   hubungkan ke proyek (centang Production, Preview, Development).
   `DATABASE_URL` akan terisi otomatis.
2. **Penyimpanan foto:** **Storage** → **Blob** → **Create** → hubungkan ke proyek.
   Pilih akses **Public**. `BLOB_STORE_ID` (atau `BLOB_READ_WRITE_TOKEN`) akan terisi otomatis.
3. **Settings → Environment Variables**, tambahkan:

   | Key | Value |
   | --- | --- |
   | `AUTH_SECRET` | teks acak minimal 32 karakter (lihat cara membuat di bawah) |
   | `ADMIN_EMAIL` | email admin pertama, mis. `admin@partnerbelajar.id` |
   | `ADMIN_PASSWORD` | password admin pertama (minimal 10 karakter, jangan dibagikan) |
   | `NEXT_PUBLIC_SITE_URL` | `https://partnerbelajar.vercel.app` |

   Membuat `AUTH_SECRET` (jalankan di terminal):

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```

4. **Deployments → ⋯ → Redeploy.** Saat build, tabel database dibuat otomatis dan diisi
   konten awal (program, jadwal, pengajar, testimoni yang sekarang tampil di situs).
5. Buka `/admin`, login dengan `ADMIN_EMAIL` & `ADMIN_PASSWORD`. Akun admin pertama dibuat
   otomatis saat login pertama. Setelah itu, **ganti password** di menu Akun Admin.
   `ADMIN_PASSWORD` di Vercel hanya dipakai jika belum ada admin sama sekali.

## Cara kerja singkat

- **Situs tetap cepat:** halaman publik statis; tidak membaca database setiap dikunjungi.
  Setelah admin menyimpan, halaman diperbarui (`lib/admin/revalidate.ts`).
- **Tanpa database** (mis. sebelum Neon dihubungkan), situs memakai data bawaan di folder `data/`.
- **Foto** otomatis dikecilkan (maks. 1600px, WebP) dan metadata (termasuk lokasi GPS) dihapus.
  Foto lama yang diganti/dihapus ikut dihapus dari penyimpanan. Lokasi penyimpanan diatur di
  `lib/storage.ts` (bisa dipindah ke Cloudflare R2 tanpa mengubah admin panel).
- **Keamanan:** password disimpan ter-hash (scrypt), sesi login 7 hari (cookie httpOnly),
  maksimal 5 percobaan login gagal per 15 menit, halaman admin tidak diindeks mesin pencari.

## Development lokal

Tanpa `DATABASE_URL`, `npm run dev` memakai database Postgres lokal (PGlite) yang dibuat & diisi
otomatis di `~/.partner-belajar/pglite` (bukan di folder proyek, karena drive FAT32 tidak didukung).
Hapus folder itu untuk mengulang dari data awal. Isi `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan
`AUTH_SECRET` di `.env.local` untuk login.

## Mengubah struktur database

1. Ubah `db/schema.ts`.
2. `npm run db:generate` → membuat file migrasi baru di `db/migrations/` (ikut di-commit).
3. Deploy — migrasi dijalankan otomatis sebelum build (`scripts/db-setup.ts`).
