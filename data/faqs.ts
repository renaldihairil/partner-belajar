export type Faq = { question: string; answer: string };

/** Pertanyaan umum di halaman Contact. Sesuaikan jawaban dengan kebijakan resmi. */
export const faqs: Faq[] = [
  {
    question: "Bagaimana cara mendaftar kelas?",
    answer:
      "Pilih program di halaman Program, klik tombol Daftar, isi formulir singkat, lalu lanjutkan di WhatsApp. Admin akan mengonfirmasi jadwal, pengajar, dan pembayaran.",
  },
  {
    question: "Apakah bisa konsultasi dulu sebelum mendaftar?",
    answer:
      "Bisa. Kirim pertanyaan lewat formulir di halaman ini atau langsung chat WhatsApp. Kami bantu merekomendasikan program dan jadwal yang sesuai usia serta kebutuhan anak.",
  },
  {
    question: "Kelas online dilaksanakan seperti apa?",
    answer:
      "Kelas online berlangsung melalui video call dengan pengajar. Tautan kelas dan panduan singkat dikirim admin sebelum pertemuan pertama.",
  },
  {
    question: "Bagaimana sistem pembayarannya?",
    answer:
      "Biaya mengikuti paket yang dipilih (per pertemuan). Detail dan metode pembayaran dikonfirmasi admin melalui WhatsApp setelah jadwal disepakati.",
  },
  {
    question: "Kapan pesan saya dibalas?",
    answer:
      "Pesan yang masuk pada jam operasional (Senin–Jumat, 08.00–17.00 WIB) kami usahakan dibalas di hari yang sama. Pesan di luar jam tersebut dibalas pada hari kerja berikutnya.",
  },
];
