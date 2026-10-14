import type { ProgramClass } from "@/types";

/**
 * Jadwal kelas awal.
 * Sekarang hanya ISI AWAL database (db/seed.ts) & cadangan bila database belum terhubung.
 * Data yang tampil di situs dikelola lewat /admin.
 * Status (dibuka / penuh / ditutup) TIDAK disimpan di sini: dihitung otomatis
 * dari kuota dan tombol "tutup" oleh lib/class-status.ts. Kelas dibuka setiap hari.
 */
export const programClasses: ProgramClass[] = [
  // English Partner
  {
    id: "en-reguler-okt-2026",
    programId: "english",
    name: "Kelas Reguler Oktober",
    days: ["Senin", "Rabu"],
    time: "16.00 – 17.00 WIB",
    mode: "online",
    quota: 12,
    enrolled: 9,
    note: "Level pemula, cocok untuk usia 6–9 tahun.",
  },
  {
    id: "en-conversation-nov-2026",
    programId: "english",
    name: "Kelas Conversation",
    days: ["Sabtu"],
    time: "09.00 – 10.30 WIB",
    mode: "hybrid",
    location: "Jl. Pendidikan No. 123, Jakarta",
    quota: 10,
    enrolled: 0,
    note: "Latihan percakapan sehari-hari untuk usia 9–12 tahun.",
  },

  // Arabic Partner
  {
    id: "ar-dasar-nov-2026",
    programId: "arabic",
    name: "Kelas Dasar Al-'Arabiyyah baina Yadaik",
    days: ["Selasa", "Kamis"],
    time: "15.30 – 16.30 WIB",
    mode: "online",
    quota: 15,
    enrolled: 0,
    note: "Mengenal kosakata dan percakapan dasar bahasa Arab.",
  },

  // Qur'an Partner
  {
    id: "qr-tahsin-okt-2026",
    programId: "quran",
    name: "Kelas Tahsin",
    days: ["Senin", "Selasa", "Rabu", "Kamis"],
    time: "18.30 – 19.30 WIB",
    mode: "offline",
    location: "Jl. Pendidikan No. 123, Jakarta",
    quota: 10,
    enrolled: 6,
    note: "Memperbaiki makharijul huruf dan tajwid.",
  },
  {
    id: "qr-tahfizh-okt-2026",
    programId: "quran",
    name: "Kelas Tahfizh Juz 30",
    days: ["Sabtu", "Ahad"],
    time: "07.00 – 08.30 WIB",
    mode: "hybrid",
    location: "Jl. Pendidikan No. 123, Jakarta",
    quota: 8,
    enrolled: 8,
    note: "Hafalan bertahap dengan murajaah rutin.",
  },

  // Diniyyah Partner
  {
    id: "dn-fiqih-sirah-sep-2026",
    programId: "diniyyah",
    name: "Kelas Fiqih Ibadah & Sirah Nabawiyah",
    days: ["Rabu", "Jumat"],
    time: "16.00 – 17.00 WIB",
    mode: "online",
    quota: 20,
    enrolled: 18,
    note: "Batch berikutnya (Kisah Para Sahabat) direncanakan Januari 2027.",
  },
];
