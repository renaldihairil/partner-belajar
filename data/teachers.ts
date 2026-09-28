import type { Teacher } from "@/types";

/**
 * CONTOH profil pengajar — ganti dengan data asli (nama, latar belakang, dan foto dengan izin).
 * Tanpa `photo`, kartu memakai avatar ilustrasi faceless sesuai identitas brand.
 */
export const teachers: Teacher[] = [
  {
    id: "hana",
    name: "Ustadzah Hana Salsabila",
    title: "Pengajar Tahsin & Tahfizh",
    programIds: ["quran"],
    experienceYears: 7,
    education: "S1 Ilmu Al-Qur'an dan Tafsir",
    highlights: ["Metode talaqqi", "Murajaah menyenangkan"],
    bio: "Sabar membimbing anak dari mengenal huruf hingga lancar tilawah dan menghafal surat pendek.",
    gender: "akhwat",
  },
  {
    id: "fikri",
    name: "Ustadz Fikri Ramadhan",
    title: "Pengajar Bahasa Arab",
    programIds: ["arabic", "diniyyah"],
    experienceYears: 6,
    education: "S1 Pendidikan Bahasa Arab",
    highlights: ["Hiwar interaktif", "Permainan kosakata"],
    bio: "Membuat bahasa Arab terasa dekat lewat percakapan sehari-hari dan kosakata dari Al-Qur'an.",
    gender: "ikhwan",
  },
  {
    id: "nadia",
    name: "Kak Nadia Putri",
    title: "English Teacher",
    programIds: ["english"],
    experienceYears: 5,
    education: "S1 Pendidikan Bahasa Inggris",
    highlights: ["Phonics & storytelling", "Kelas anak usia dini"],
    bio: "Mengajak anak berani berbicara bahasa Inggris melalui lagu, cerita, dan permainan peran.",
    gender: "akhwat",
  },
  {
    id: "rizky",
    name: "Kak Rizky Pratama",
    title: "English Conversation Coach",
    programIds: ["english"],
    experienceYears: 4,
    education: "S1 Sastra Inggris",
    highlights: ["Public speaking", "Role play percakapan"],
    bio: "Fokus membangun rasa percaya diri anak untuk presentasi dan bercakap dalam bahasa Inggris.",
    gender: "ikhwan",
  },
  {
    id: "maryam",
    name: "Ustadzah Maryam Azzahra",
    title: "Pengajar Diniyyah & Sirah",
    programIds: ["diniyyah", "quran"],
    experienceYears: 6,
    education: "S1 Pendidikan Agama Islam",
    highlights: ["Kisah sirah untuk anak", "Praktik ibadah"],
    bio: "Menanamkan akidah, adab, dan kecintaan kepada Rasulullah ﷺ lewat kisah yang hangat.",
    gender: "akhwat",
  },
  {
    id: "hamzah",
    name: "Ustadz Hamzah Abdullah",
    title: "Pengajar Tahfizh",
    programIds: ["quran"],
    experienceYears: 9,
    education: "S1 Syariah",
    highlights: ["Pembina halaqah anak", "Target hafalan terukur"],
    bio: "Mendampingi hafalan anak secara bertahap dengan setoran dan murajaah yang konsisten.",
    gender: "ikhwan",
  },
];
