# Admin panel Partner Belajar

Admin panel ada di **`/admin`** (mis. `https://partnerbelajar.vercel.app/admin`).
Yang bisa dikelola:

| Menu | Isi |
| --- | --- |
| Program & Jadwal | Info program, gambar, kurikulum, hasil belajar, "cocok untuk", paket harga, jadwal kelas (tanggal, hari, jam, mode, kuota, jumlah terdaftar, tutup manual) |
| Pengajar | Profil, foto, program yang diajar, keunggulan, tampil/sembunyi, urutan |
| Testimoni | Isi, rating, program, kota, tanggal, tampil/sembunyi, urutan |
| Link Testimoni | Buat, salin, dan bagikan link agar orang tua mengirim testimoni sendiri (lihat bagian di bawah) |
| Link Form Guru | Buat, salin, dan bagikan link (PIN opsional) agar guru mengisi data profilnya sendiri; data masuk sebagai draf untuk ditinjau |
| Artikel | Judul, ringkasan, isi (blok paragraf/subjudul/daftar/tips), gambar sampul, kategori, tag, penulis, tanggal terbit, draf/terbit, artikel pilihan |
| Dokumentasi | Video dokumentasi dari YouTube (tempel tautan): judul, keterangan, kategori, tanggal, program terkait, tampil/sembunyi. Ditampilkan sebagai grid 3 kolom; klik untuk memutar |
| Akun Saya | Profil sendiri dan ganti password (semua admin) |
| Kelola Admin | Khusus Pemilik: tambah/ubah/hapus admin, atur peran & menu yang boleh diakses |

## Peran & hak akses

| Peran | Akses |
| --- | --- |
| **Pemilik** | Semua menu + mengelola akun admin lain. Akun admin yang sudah ada otomatis menjadi Pemilik. |
| **Editor** | Hanya menu yang dicentang: Program & Jadwal, Pengajar, Testimoni, Artikel, Dokumentasi. Menu lain tidak tampil dan alamatnya dialihkan ke dashboard. |

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
   otomatis saat login pertama. Setelah itu, **ganti password** di menu Akun Saya.
   `ADMIN_PASSWORD` di Vercel hanya dipakai jika belum ada admin sama sekali.

## Link Testimoni (orang tua mengirim sendiri)

Menu **Link Testimoni** (butuh akses "Testimoni") membuat link publik berbentuk
`/kirim-testimoni/<kode>` yang bisa dibagikan ke orang tua, misalnya lewat WhatsApp.

1. Buka **Link Testimoni**, isi nama link (catatan untuk Anda) dan, bila perlu, pilih program, lalu **Buat link**.
2. Klik **Salin** (atau tombol WhatsApp untuk membuka WhatsApp dengan pesan siap kirim) lalu bagikan.
3. Orang tua mengisi 4 kolom: **nama wali**, **nama anak**, **jumlah bintang**, dan **testimoni**.
4. Begitu dikirim, testimoni **langsung tampil** di Home dan halaman Testimoni, tanpa persetujuan admin.
   Di daftar Testimoni admin, kiriman ini diberi label **Via link**; bila tidak sesuai, sembunyikan atau hapus.

Detail penting:
- Link yang dibuat untuk satu program otomatis mengaitkan testimoni ke program itu (muncul di filter program). Link "umum" tidak terkait program.
- **Nonaktifkan** link kapan saja (tombol power): halaman langsung menampilkan "Link ini sudah tidak aktif" dan kiriman baru ditolak. **Hapus** link tidak menghapus testimoni yang sudah masuk.
- Nama anak ikut tampil di keterangan ("Orang tua dari Zahra"), dan formulir memberi tahu hal ini ke orang tua.
- Perlindungan spam: kolom jebakan untuk robot, tautan/URL di teks ditolak, maksimal 6 kiriman per 30 menit per perangkat (alamat IP hanya disimpan dalam bentuk hash), dan kiriman ganda yang identik tidak disimpan dua kali.
- Halaman ini tidak diindeks mesin pencari (noindex + robots.txt).

## Link Form Guru (guru mengisi data sendiri)

Menu **Link Form Guru** (butuh akses "Pengajar") membuat link publik berbentuk
`/form-guru/<kode>` yang dibagikan ke para guru, misalnya lewat WhatsApp.

1. Buka **Link Form Guru**, isi nama link (catatan untuk Anda), lalu **Buat link**.
   **PIN bersifat opsional**: kosongkan agar link terbuka seperti link testimoni, atau isi 4–8 angka
   (tombol **Acak** membuat PIN 6 angka) agar guru harus memasukkan PIN sebelum bisa mengisi.
2. Klik **Salin** (atau tombol WhatsApp untuk pesan siap kirim). Bila memakai PIN, kirim PIN **terpisah** dari link.
3. Guru mengisi: nama lengkap, jenis kelamin, kontak (opsional), foto (opsional), program yang diajar,
   jabatan/keahlian, pendidikan, lama mengajar, bio singkat, dan keunggulan (maks. 6).
4. Data yang masuk berstatus **tersembunyi (Perlu ditinjau)**, belum tampil di situs. Buka **Pengajar**, periksa/edit,
   lalu tampilkan lewat tombol mata atau saklar "Tampilkan". Di daftar, kiriman ini diberi label **Via form**.

Detail penting:
- **Kontak guru hanya dilihat admin** (di halaman edit pengajar), tidak pernah tampil di situs.
- **Atur PIN** (tombol kunci di baris link): isi PIN baru untuk mengganti, atau kosongkan untuk menghapus PIN.
  PIN disimpan sebagai hash sehingga **tidak bisa dilihat lagi**, hanya bisa diganti. Begitu PIN diganti,
  guru yang sedang mengisi dengan PIN lama harus memasukkan PIN baru.
- **Perlindungan PIN:** maksimal 5 PIN salah per perangkat dan 20 per link dalam 15 menit; setelah itu terkunci
  15 menit (PIN yang benar pun ditolak selama terkunci).
- **Nonaktifkan** link kapan saja (tombol power): halaman langsung menampilkan "Link ini sudah tidak aktif" dan
  kiriman baru ditolak. **Hapus** link tidak menghapus data guru yang sudah masuk.
- Perlindungan spam: kolom jebakan untuk robot, maksimal 8 kiriman dan 12 unggahan foto per 30 menit per perangkat
  (alamat IP hanya disimpan dalam bentuk hash), serta kiriman ganda yang identik tidak disimpan dua kali.
  Foto otomatis dikecilkan menjadi WebP dan datanya (termasuk lokasi GPS) dibersihkan.
- Halaman ini tidak diindeks mesin pencari (noindex + robots.txt).

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
