# Tracking Pendaftaran WhatsApp → Google Sheets

Setiap kali pengunjung menekan **Lanjut ke WhatsApp** (formulir pendaftaran) atau **Kirim via WhatsApp**
(formulir Contact), website melakukan dua hal:

1. Mengirim data ke `/api/leads` (server website).
2. Membuka WhatsApp ke **+62 878-2004-7377** dengan pesan yang sudah terisi dan diakhiri **kode pendaftaran**,
   mis. `Kode: PB-EN-7K3F`.

Admin mencocokkan **kode** di chat WhatsApp dengan baris di spreadsheet, jadi langsung tahu kelas apa,
siapa orang tua/anaknya, dari kota mana, dan dari mana mereka menemukan Partner Belajar.

## Data yang tercatat

| Kolom | Isi |
| --- | --- |
| Waktu | Waktu data diterima server |
| Kode | `PB-<kode program>-XXXX` (EN, AR, QR, DN; `CT` untuk pertanyaan umum) |
| Jenis | `daftar`, `ingatkan` (belum dibuka), `tunggu` (kuota penuh), `info` (ditutup), `tanya` (Contact) |
| Program, Kelas, Paket | Pilihan pengunjung |
| Orang tua, Anak, Usia, Kota | Diisi pengunjung |
| No. WA | Dari formulir Contact (opsional) |
| Tahu dari | Pilihan pengunjung (terisi otomatis dari UTM/referrer bila ada) |
| UTM source / medium / campaign | Dari link kampanye, mis. `?utm_source=instagram&utm_campaign=promo-okt` |
| Referrer, Halaman pertama | Situs asal & halaman pertama yang dibuka pengunjung |
| Halaman daftar, Perangkat | Halaman tempat formulir dikirim, mobile/desktop |
| Kota (IP), Provinsi (IP) | Perkiraan lokasi dari IP (otomatis saat di-deploy di Vercel) |

> Tanpa langkah di bawah pun data tetap tercatat di **Vercel → Project → Logs** (cari `[lead]`).
> Google Sheets membuatnya jauh lebih mudah dibaca admin.

## Setup Google Sheets (±10 menit, gratis)

1. Buat Google Spreadsheet baru, mis. **"Pendaftaran Partner Belajar"**.
2. Menu **Extensions → Apps Script**. Hapus isi editor, tempel kode berikut, lalu ganti `SECRET`:

```js
const SECRET = "ganti-dengan-kata-rahasia-panjang";

const COLUMNS = [
  ["receivedAt", "Waktu"],
  ["ref", "Kode"],
  ["intent", "Jenis"],
  ["programTitle", "Program"],
  ["className", "Kelas"],
  ["planLabel", "Paket"],
  ["parentName", "Orang tua"],
  ["childName", "Anak"],
  ["childAge", "Usia"],
  ["city", "Kota"],
  ["whatsapp", "No. WA"],
  ["source", "Tahu dari"],
  ["notes", "Catatan"],
  ["utmSource", "UTM source"],
  ["utmMedium", "UTM medium"],
  ["utmCampaign", "UTM campaign"],
  ["referrer", "Referrer"],
  ["landingPage", "Halaman pertama"],
  ["pagePath", "Halaman daftar"],
  ["device", "Perangkat"],
  ["ipCity", "Kota (IP)"],
  ["ipRegion", "Provinsi (IP)"],
];

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.secret !== SECRET) {
    return ContentService.createTextOutput("forbidden");
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leads") || ss.insertSheet("Leads");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map((c) => c[1]));
    sheet.setFrozenRows(1);
  }
  sheet.appendRow(COLUMNS.map((c) => data[c[0]] || ""));
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON,
  );
}
```

3. Klik **Deploy → New deployment → Select type: Web app**.
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Klik **Deploy**, izinkan akses, lalu salin **Web app URL** (`https://script.google.com/macros/s/.../exec`).
4. Di **Vercel → Project → Settings → Environment Variables**, tambahkan:
   - `LEADS_WEBHOOK_URL` = Web app URL dari langkah 3
   - `LEADS_WEBHOOK_SECRET` = kata rahasia yang sama dengan `SECRET` di script
5. **Redeploy** project. Coba daftar dari website. Baris baru akan muncul di sheet **Leads**.

## Tips memakai link kampanye

Tambahkan UTM pada link yang dibagikan agar sumber pendaftar tercatat otomatis:

```text
https://partnerbelajar.my.id/program/english-partner?utm_source=instagram&utm_medium=bio&utm_campaign=oktober-2026
```

## Catatan privasi

Data berisi nama anak dan orang tua. Batasi akses spreadsheet hanya untuk admin, dan hapus data yang
tidak lagi diperlukan.
