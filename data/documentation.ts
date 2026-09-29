import type { DocumentationItem } from "@/types";

/**
 * CONTOH dokumentasi berupa video YouTube (fallback bila database belum terhubung).
 * Konten asli dikelola di admin panel; pastikan ada izin orang tua bila anak tampil di video.
 */
/** Video contoh sementara — ganti lewat admin panel (menu Dokumentasi). */
const VIDEO = "qgnDbQ1aM54";

export const documentation: DocumentationItem[] = [
  { id: "d1", title: "Praktik percakapan English", caption: "Siswa English Partner berlatih memperkenalkan diri dengan percaya diri.", date: "2026-09-18", category: "Kelas Online", programId: "english", youtubeId: VIDEO },
  { id: "d2", title: "Setoran hafalan Juz 30", caption: "Setoran hafalan pekanan dengan metode talaqqi.", date: "2026-09-15", category: "Tatap Muka", programId: "quran", youtubeId: VIDEO },
  { id: "d3", title: "Mengenal mufradat", caption: "Belajar kosakata bahasa Arab lewat benda di sekitar rumah.", date: "2026-09-10", category: "Kelas Online", programId: "arabic", youtubeId: VIDEO },
  { id: "d4", title: "Kisah sahabat bersama keluarga", caption: "Sesi sirah yang juga diikuti orang tua di rumah.", date: "2026-09-05", category: "Kegiatan Spesial", programId: "diniyyah", youtubeId: VIDEO },
  { id: "d5", title: "Hari pertama semester baru", caption: "Penyambutan siswa baru dengan permainan perkenalan.", date: "2026-08-25", category: "Kegiatan Spesial", youtubeId: VIDEO },
  { id: "d6", title: "Pendampingan kelas online", caption: "Tim kami memastikan kelas online berjalan lancar untuk setiap anak.", date: "2026-08-20", category: "Kelas Online", youtubeId: VIDEO },
  { id: "d7", title: "Tahsin makharijul huruf", caption: "Memperbaiki pelafalan huruf hijaiyah satu per satu.", date: "2026-08-14", category: "Tatap Muka", programId: "quran", youtubeId: VIDEO },
  { id: "d8", title: "Show & tell", caption: "Presentasi mini bahasa Inggris tentang benda favorit.", date: "2026-08-08", category: "Tatap Muka", programId: "english", youtubeId: VIDEO },
  { id: "d9", title: "Wisuda tahfizh mini", caption: "Apresiasi untuk siswa yang menuntaskan target hafalan.", date: "2026-07-30", category: "Kegiatan Spesial", programId: "quran", youtubeId: VIDEO },
];
