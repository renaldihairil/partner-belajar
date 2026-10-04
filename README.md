# Partner Belajar

Website edukasi responsif Partner Belajar: Home, Program, Artikel, Pengajar, Dokumentasi, Testimoni, Contact, dan admin panel.
Dibangun dengan Next.js (App Router), React, TypeScript, Tailwind CSS v4, dan Lucide React.

- **Desktop (≥ 768px):** sidebar kiri berisi 7 menu (Home, Program, Artikel, Pengajar, Dokumentasi, Testimoni, Contact)
  + bar atas (pencarian & tombol mode terang/gelap).
- **Mobile (< 768px):** header (logo + tombol mode terang/gelap) + bottom navigation
  Home · Program · Artikel · **Lainnya** (panel berisi Pengajar, Dokumentasi, Testimoni, Contact).
- **Mode gelap:** tombol tema di header; pilihan disimpan di browser (`localStorage: pb-theme`), default terang.
  Semua warna berasal dari token di `app/globals.css` (`:root` & `:root[data-theme="dark"]`).

**Admin panel** di `/admin` untuk mengelola Program & Jadwal, Pengajar, dan Testimoni (database Neon + foto di Vercel Blob).
Panduan setup & cara kerja: **[docs/admin-panel.md](docs/admin-panel.md)**.
Orang tua bisa mengirim testimoni sendiri lewat link yang dibuat di admin (menu **Link Testimoni**, halaman `/kirim-testimoni/<kode>`).

Menu diatur di satu tempat: `components/navigation/navigation-config.ts`
(`mobile: "primary" | "more"` menentukan posisi di mobile; sitemap ikut otomatis).

## Menjalankan secara lokal

Butuh Node.js 20 atau lebih baru.

```bash
npm install
cp .env.example .env.local   # opsional, default http://localhost:3000
npm run dev
```

Buka http://localhost:3000.

| Perintah         | Fungsi                             |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Development server                 |
| `npm run lint`   | ESLint                             |
| `npm run build`  | Build produksi (termasuk cek tipe) |
| `npm start`      | Menjalankan hasil build            |
| `npm run db:generate` | Membuat migrasi setelah mengubah `db/schema.ts` |
| `npm run db:setup` | Migrasi + isi data awal ke database `DATABASE_URL` (otomatis saat build) |

## Struktur

```text
app/                 Rute (/, /program, /artikel, /contact), sitemap, robots, ikon
components/
  layout/            AppShell, DesktopSidebar, MobileHeader, MobileBottomNav, TopSearchBar
  navigation/        NavItem + navigation-config (satu sumber rute untuk semua navigasi)
  ui/                Button, Card, ArrowButton, SearchBar, PageHeader, Logo, Decor
  character/         CharacterIllustration
  home/ program/ artikel/ contact/   Komponen per halaman
data/                Mock data: programs, articles, features
lib/                 site-config (URL, kontak, logo), metadata SEO, format tanggal
types/               Tipe Program, Article, Feature
public/logo/         Logo
public/characters/   Ilustrasi karakter anak Muslim faceless
public/images/articles/  Sampul artikel (sementara)
```

## Design tokens

Semua warna ada di `app/globals.css` (`:root`) dan dipetakan ke utilitas Tailwind lewat `@theme`,
misalnya `bg-brand-teal`, `text-ink`, `bg-soft-blue`. Ubah warna di sana, jangan di JSX.

## Aset (penting)

Logo sudah memakai file resmi (`public/logo/partner-belajar-logo-original.png` = master resolusi tinggi).
Ilustrasi karakter saat ini masih **diekstrak dari gambar referensi desain**
sebagai placeholder, sehingga resolusinya rendah. Ganti dengan file asli beresolusi tinggi
**dengan nama file yang sama** agar tidak perlu mengubah kode:

| File                                          | Isi                                   |
| --------------------------------------------- | ------------------------------------- |
| `public/logo/partner-belajar-logo.png`        | Logo resmi versi web (sudah final)    |
| `public/characters/hero-kids.webp`            | Hero Home (sudah final, PNG/WebP transparan) |
| `public/characters/english.webp`, `arabic.webp`, `quran.webp`, `diniyyah.webp` | Ilustrasi program (sudah final, transparan) |
| `public/characters/contact-admin.webp`      | Hero Contact (headset + laptop)       |
| `public/images/articles/cover-*.webp`         | Sampul artikel (ilustrasi **sementara** 1200×750, rasio 16:10) |
| `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`, `public/icons/*` | Favicon & ikon situs (sudah final, dari logo mark). Situs ini website biasa, bukan aplikasi web (tanpa manifest/PWA) |
| `public/og-image.jpg`                         | Gambar Open Graph 1200×630            |

Jika rasio gambar baru berbeda, sesuaikan `width`/`height` di komponen terkait
(atau di `lib/site-config.ts` untuk logo).

## Konten

- **Program & jadwal kelas, Pengajar, Testimoni: dikelola di `/admin`** (database). File `data/programs.ts`,
  `data/program-classes.ts`, `data/teachers.ts`, `data/testimonials.ts` hanya dipakai sebagai **isi awal** database
  dan cadangan bila database belum terhubung. Pengajar tanpa foto memakai avatar ilustrasi faceless (berpeci/berhijab).
- Dokumentasi: `data/documentation.ts` + `public/images/dokumentasi/` — **gambar masih ilustrasi placeholder**,
  ganti dengan foto kegiatan asli (wajib izin orang tua)
- Alasan memilih: `data/reasons.ts`
- Statistik (angka berhitung): `data/stats.ts` — **angka masih contoh**, ganti dengan data asli
- Pengajar & testimoni awal masih **contoh** — ganti lewat admin dengan data asli (dengan izin) sebelum publikasi.
- Artikel: `data/articles.ts` — **contoh**; tiap artikel berisi kategori, tag, penulis, ringkasan, dan isi berupa blok (`p`, `h2`, `list`, `tip`). Tanggal format ISO `YYYY-MM-DD`; waktu baca dihitung otomatis. `featured: true` = tampil sebagai Artikel Pilihan. Helper di `lib/articles.ts`.
- Kontak: `lib/site-config.ts`

## Jadwal kelas & pendaftaran

Halaman **Program** menampilkan status pendaftaran tiap program: **Pendaftaran dibuka**, **Segera dibuka**,
**Kuota penuh**, atau **Pendaftaran ditutup**, lengkap dengan tanggal mulai, jadwal, mode, sisa kursi,
filter status, dan panel jadwal (dialog) per program.

| Bagian | File |
| --- | --- |
| Tipe data (`ProgramClass`, `ProgramWithClasses`, `RegistrationStatus`) | `types/index.ts` |
| Jadwal kelas | Admin → Program & Jadwal → tab Jadwal kelas |
| Hitung status dari tanggal (WIB) + kuota | `lib/class-status.ts` |
| Sumber data (database ↔ data bawaan) | `lib/programs-service.ts` |
| Tujuan tombol daftar/ingatkan/daftar tunggu | `components/program/registration.ts` |
| UI | `components/program/*` |

- **Status tidak disimpan**, melainkan dihitung otomatis: sebelum `registrationOpens` → segera dibuka;
  setelah `registrationCloses` → ditutup; `enrolled >= quota` → penuh; `manuallyClosed: true` → ditutup paksa (untuk admin).
- Status dihitung ulang di browser pengunjung setiap menit, dan HTML diperbarui berkala (`revalidate = 3600`).
- Tautan langsung ke jadwal: `/program#jadwal-<slug>`, mis. `/program#jadwal-quran-partner`.
- Klik kartu → halaman detail `/program/<slug>` (Hero, Kurikulum, Cocok untuk siapa, Jadwal, Harga, CTA).

Konten halaman detail (kurikulum, target peserta, hasil belajar, harga) dikelola di admin (Program → Info & konten).
Jika database error, situs otomatis kembali memakai data bawaan agar tidak rusak.

## Pendaftaran via WhatsApp + tracking

Semua tombol daftar (kartu program, halaman detail, harga, jadwal) membuka **satu formulir singkat**
(`components/registration/*`): program, jadwal, paket, nama orang tua & anak, usia, kota, dan sumber info.
Setelah dikirim:

1. Data dikirim ke `/api/leads` (`app/api/leads/route.ts`) → dicatat di log server dan, jika
   `LEADS_WEBHOOK_URL` diisi, diteruskan ke **Google Sheets**.
2. WhatsApp terbuka ke **+62 878-2004-7377** dengan pesan rapi yang diakhiri **kode pendaftaran** (mis. `PB-EN-7K3F`).

Admin cukup mencocokkan kode di chat dengan baris di spreadsheet. Sumber kunjungan (UTM/referrer), halaman,
perangkat, dan perkiraan kota (IP, di Vercel) ikut tercatat otomatis. Panduan setup:
**[docs/tracking-pendaftaran.md](docs/tracking-pendaftaran.md)**. Nomor WhatsApp diatur di `lib/site-config.ts`.

## Perilaku Phase 1

- Pencarian di header membuka `/artikel?q=…`; penyaringan dilakukan di browser (belum ada backend pencarian).
- Tiap artikel punya halaman detail `/artikel/[slug]` (statis) dengan tombol bagikan (WhatsApp, Facebook, X, Telegram, salin link). Di HP, tombol bagikan pada kartu membuka lembar bagikan bawaan perangkat.
- Formulir Contact juga diteruskan ke WhatsApp (jenis `tanya`) dengan tracking yang sama.

## Deployment

URL situs dibaca dari `NEXT_PUBLIC_SITE_URL` (dipakai untuk canonical, Open Graph, sitemap, robots).
Mengganti domain tidak memerlukan perubahan kode.

| Lingkungan | `NEXT_PUBLIC_SITE_URL`             |
| ---------- | ---------------------------------- |
| Lokal      | `http://localhost:3000`            |
| Vercel     | `https://<project>.vercel.app`     |
| Final      | `https://partnerbelajar.my.id`     |

Jika variabel tidak diisi di Vercel, `VERCEL_URL` dipakai otomatis.

### GitHub + Vercel

```bash
git init
git add .
git commit -m "chore: initialize Partner Belajar website"
git branch -M main
git remote add origin https://github.com/<user>/partner-belajar.git
git push -u origin main
```

Lalu di Vercel: **Add New → Project → import repo `partner-belajar`**, framework otomatis Next.js,
tambahkan environment variable `NEXT_PUBLIC_SITE_URL`, lalu **Deploy**.
Untuk admin panel, hubungkan Neon & Blob dan isi `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
(langkah lengkap di [docs/admin-panel.md](docs/admin-panel.md)).
Domain `partnerbelajar.my.id` ditambahkan nanti lewat **Settings → Domains**.

## Kecepatan pindah halaman

Di `npm run dev`, halaman di-compile saat pertama kali dibuka (2–4 detik di mesin ini), kunjungan berikutnya
~0,2 detik. Di produksi (`npm run build && npm start` atau Vercel) semua halaman sudah statis dan
link di navigasi di-prefetch, jadi perpindahan halaman instan.

## Catatan Windows: drive FAT32/exFAT

`npm run build` gagal dengan `EISDIR: illegal operation on a directory, readlink` jika proyek berada
di drive FAT32/exFAT (keterbatasan Node.js, bukan bug kode). `npm run dev` tetap berjalan normal.
Solusi: letakkan proyek di drive NTFS (mis. `C:\`) untuk build lokal. Build di Vercel tidak terpengaruh.
