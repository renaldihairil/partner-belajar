import type { ProgramClass } from "@/types";

/**
 * MOCK jadwal kelas & pendaftaran (Phase 1, frontend saja).
 * Nanti diganti oleh data dari API/admin panel — lihat lib/programs-service.ts.
 * Status (dibuka / segera / penuh / ditutup) TIDAK disimpan di sini: dihitung otomatis
 * dari tanggal + kuota oleh lib/class-status.ts, jadi cukup ubah tanggalnya.
 */
export const programClasses: ProgramClass[] = [
  // English Partner
  {
    id: "en-reguler-okt-2026",
    programId: "english",
    name: "Kelas Reguler Oktober",
    registrationOpens: "2026-09-15",
    registrationCloses: "2026-10-10",
    classStarts: "2026-10-13",
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
    registrationOpens: "2026-10-20",
    registrationCloses: "2026-11-08",
    classStarts: "2026-11-10",
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
    registrationOpens: "2026-10-05",
    registrationCloses: "2026-10-25",
    classStarts: "2026-11-02",
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
    registrationOpens: "2026-09-01",
    registrationCloses: "2026-10-15",
    classStarts: "2026-10-19",
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
    registrationOpens: "2026-09-01",
    registrationCloses: "2026-10-15",
    classStarts: "2026-10-19",
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
    registrationOpens: "2026-08-15",
    registrationCloses: "2026-09-20",
    classStarts: "2026-09-22",
    days: ["Rabu", "Jumat"],
    time: "16.00 – 17.00 WIB",
    mode: "online",
    quota: 20,
    enrolled: 18,
    note: "Batch berikutnya (Kisah Para Sahabat) direncanakan Januari 2027.",
  },
];
