import type { PricePlan, Program } from "@/types";

/**
 * Paket harga standar (mengikuti contoh "Pilih Kelas Sesuai Kebutuhan").
 * CONTOH — sesuaikan dengan harga resmi. Tiap program boleh punya paket sendiri.
 */
function standardPricing(overrides: Partial<Record<"privat" | "duo" | "trio", number>> = {}): PricePlan[] {
  return [
    {
      id: "privat",
      label: "1 Siswa • 1 Pengajar",
      price: overrides.privat ?? 80000,
      unit: "per pertemuan",
      features: ["Belajar lebih fokus", "Materi full personal", "Progres lebih cepat"],
    },
    {
      id: "duo",
      label: "2 Siswa • 1 Pengajar",
      price: overrides.duo ?? 40000,
      unit: "per siswa / pertemuan",
      features: ["Belajar bersama teman", "Lebih hemat", "Tetap fokus"],
      popular: true,
    },
    {
      id: "trio",
      label: "3 Siswa • 1 Pengajar",
      price: overrides.trio ?? 30000,
      unit: "per siswa / pertemuan",
      features: ["Belajar lebih seru", "Paling hemat", "Tetap efektif"],
    },
  ];
}

export const programs: Program[] = [
  {
    id: "english",
    slug: "english-partner",
    code: "EN",
    title: "English Partner",
    description: "Belajar bahasa Inggris dengan metode interaktif dan menyenangkan.",
    image: "/characters/english.webp",
    imageAlt: "Ilustrasi anak laki-laki berpeci membaca buku English for Everyday Life",
    theme: "blue",
    category: "Bahasa",
    ageRange: "6–12 tahun",
    tagline: "Berani bicara bahasa Inggris, mulai dari percakapan sehari-hari.",
    longDescription:
      "Anak belajar bahasa Inggris lewat permainan, lagu, cerita, dan praktik percakapan. Fokus kami bukan sekadar hafalan kosakata, tetapi membangun rasa percaya diri untuk berbicara.",
    facts: [
      { label: "Usia", value: "6–12 tahun" },
      { label: "Durasi", value: "60 menit / pertemuan" },
      { label: "Frekuensi", value: "2× seminggu" },
      { label: "Mode", value: "Online & tatap muka" },
    ],
    curriculum: [
      {
        id: "en-1",
        level: "Level 1",
        title: "Starter — Kenalan dengan Bahasa Inggris",
        duration: "8 pertemuan",
        topics: ["Alphabet & phonics", "Greetings & introductions", "Colors, numbers, shapes", "Classroom English"],
      },
      {
        id: "en-2",
        level: "Level 2",
        title: "Everyday English",
        duration: "12 pertemuan",
        topics: ["Family & my home", "Daily routines", "Food & shopping", "Simple present tense"],
      },
      {
        id: "en-3",
        level: "Level 3",
        title: "Speak Up!",
        duration: "12 pertemuan",
        topics: ["Asking & giving directions", "Storytelling sederhana", "Role play percakapan", "Past tense dasar"],
      },
      {
        id: "en-4",
        level: "Level 4",
        title: "Confident Communicator",
        duration: "12 pertemuan",
        topics: ["Show & tell / presentasi mini", "Reading comprehension", "Menulis paragraf pendek", "Project akhir"],
      },
    ],
    outcomes: [
      "Berani memperkenalkan diri dan bercakap sederhana",
      "Menguasai ±500 kosakata sehari-hari",
      "Membaca teks pendek dengan pelafalan yang benar",
      "Laporan perkembangan rutin untuk orang tua",
    ],
    audience: [
      { icon: "sprout", title: "Baru mulai belajar", description: "Anak yang belum pernah les bahasa Inggris dan butuh dasar yang kuat." },
      { icon: "heart", title: "Masih malu berbicara", description: "Sudah tahu kosakata, tapi belum percaya diri untuk mengucapkannya." },
      { icon: "rocket", title: "Ingin nilai sekolah naik", description: "Butuh pendampingan agar pelajaran bahasa Inggris di sekolah terasa mudah." },
      { icon: "users", title: "Orang tua yang sibuk", description: "Ingin anak belajar teratur dengan laporan perkembangan yang jelas." },
    ],
    pricing: standardPricing(),
  },
  {
    id: "arabic",
    slug: "arabic-partner",
    code: "AR",
    title: "Arabic Partner",
    description: "Mahir berbahasa Arab untuk membuka lebih banyak peluang.",
    image: "/characters/arabic.webp",
    imageAlt: "Ilustrasi anak perempuan berhijab kuning memeluk buku Al-'Arabiyyah baina Yadaik",
    theme: "yellow",
    category: "Bahasa",
    ageRange: "7–13 tahun",
    tagline: "Bahasa Arab yang mudah dipahami, dekat dengan bahasa Al-Qur'an.",
    longDescription:
      "Menggunakan rujukan Al-'Arabiyyah baina Yadaik yang disederhanakan untuk anak. Anak belajar kosakata, percakapan, dan dasar tata bahasa secara bertahap dan menyenangkan.",
    facts: [
      { label: "Usia", value: "7–13 tahun" },
      { label: "Durasi", value: "60 menit / pertemuan" },
      { label: "Frekuensi", value: "2× seminggu" },
      { label: "Mode", value: "Online" },
    ],
    curriculum: [
      {
        id: "ar-1",
        level: "Level 1",
        title: "Mufradat Dasar",
        duration: "8 pertemuan",
        topics: ["Huruf & harakat", "Salam & perkenalan", "Benda di sekitar", "Angka 1–100"],
      },
      {
        id: "ar-2",
        level: "Level 2",
        title: "Hiwar — Percakapan Harian",
        duration: "12 pertemuan",
        topics: ["Di sekolah & di rumah", "Keluarga", "Makanan & minuman", "Kegiatan sehari-hari"],
      },
      {
        id: "ar-3",
        level: "Level 3",
        title: "Qawa'id Dasar",
        duration: "12 pertemuan",
        topics: ["Isim, fi'il, huruf", "Mudzakkar & mu'annats", "Dhamir (kata ganti)", "Kalimat sederhana"],
      },
      {
        id: "ar-4",
        level: "Level 4",
        title: "Qira'ah & Kitabah",
        duration: "12 pertemuan",
        topics: ["Membaca teks pendek", "Menulis kalimat", "Memahami kosakata Al-Qur'an", "Presentasi singkat"],
      },
    ],
    outcomes: [
      "Menguasai ±400 mufradat sehari-hari",
      "Mampu bercakap sederhana dalam bahasa Arab",
      "Memahami struktur kalimat dasar",
      "Lebih mudah memahami makna ayat-ayat pendek",
    ],
    audience: [
      { icon: "sprout", title: "Pemula total", description: "Anak yang ingin mulai belajar bahasa Arab dari nol." },
      { icon: "star", title: "Siswa pesantren / SDIT", description: "Butuh penguatan pelajaran bahasa Arab di sekolah." },
      { icon: "heart", title: "Ingin memahami Al-Qur'an", description: "Mengenal kosakata yang sering muncul di Al-Qur'an dan doa harian." },
      { icon: "rocket", title: "Persiapan masa depan", description: "Bekal studi lanjutan ke pesantren atau Timur Tengah." },
    ],
    pricing: standardPricing(),
  },
  {
    id: "quran",
    slug: "quran-partner",
    code: "QR",
    title: "Qur'an Partner",
    description: "Mendekatkan diri kepada Al-Qur'an dengan cara yang tepat.",
    image: "/characters/quran.webp",
    imageAlt: "Ilustrasi anak laki-laki berpeci membaca mushaf Al-Qur'an",
    theme: "green",
    category: "Al-Qur'an",
    ageRange: "5–13 tahun",
    tagline: "Membaca Al-Qur'an dengan tartil, menghafal dengan cinta.",
    longDescription:
      "Program tahsin dan tahfizh bertahap, mulai dari mengenal huruf hijaiyah hingga hafalan Juz 30. Dibimbing pengajar yang sabar dengan metode talaqqi dan murajaah rutin.",
    facts: [
      { label: "Usia", value: "5–13 tahun" },
      { label: "Durasi", value: "60–90 menit / pertemuan" },
      { label: "Frekuensi", value: "2–4× seminggu" },
      { label: "Mode", value: "Tatap muka & hybrid" },
    ],
    curriculum: [
      {
        id: "qr-1",
        level: "Tahap 1",
        title: "Pengenalan Huruf Hijaiyah",
        duration: "± 1 bulan",
        topics: ["Huruf & makharijul huruf", "Harakat & tanwin", "Membaca per suku kata"],
      },
      {
        id: "qr-2",
        level: "Tahap 2",
        title: "Tahsin — Tilawah dengan Tajwid",
        duration: "± 3 bulan",
        topics: ["Hukum nun & mim sukun", "Mad & qalqalah", "Waqaf & ibtida'", "Tilawah juz 'amma"],
      },
      {
        id: "qr-3",
        level: "Tahap 3",
        title: "Tahfizh Juz 30",
        duration: "± 6 bulan",
        topics: ["Hafalan bertahap (talaqqi)", "Murajaah harian", "Setoran & evaluasi pekanan"],
      },
      {
        id: "qr-4",
        level: "Tahap 4",
        title: "Pemahaman & Adab",
        duration: "Berjalan bersama",
        topics: ["Makna surat pendek", "Adab membaca Al-Qur'an", "Doa & dzikir harian"],
      },
    ],
    outcomes: [
      "Membaca Al-Qur'an lancar sesuai kaidah tajwid",
      "Hafal surat-surat pendek Juz 30",
      "Terbiasa murajaah dan adab membaca Al-Qur'an",
      "Laporan setoran hafalan untuk orang tua",
    ],
    audience: [
      { icon: "sprout", title: "Baru mengenal huruf", description: "Anak yang sedang belajar membaca Al-Qur'an dari awal." },
      { icon: "shield", title: "Ingin bacaan lebih benar", description: "Sudah bisa membaca, tapi ingin memperbaiki makhraj dan tajwid." },
      { icon: "star", title: "Target hafalan", description: "Ingin menyelesaikan hafalan Juz 30 dengan pendampingan." },
      { icon: "heart", title: "Menanamkan cinta Al-Qur'an", description: "Orang tua yang ingin Al-Qur'an jadi kebiasaan harian anak." },
    ],
    pricing: standardPricing(),
  },
  {
    id: "diniyyah",
    slug: "diniyyah-partner",
    code: "DN",
    title: "Diniyyah Partner",
    description: "Belajar seputar ilmu agama dan sirah Nabi beserta para sahabat.",
    image: "/characters/diniyyah.webp",
    imageAlt: "Ilustrasi keluarga Muslim bersama anak-anak yang membawa tas sekolah dan mushaf",
    theme: "purple",
    category: "Ilmu Agama",
    ageRange: "7–13 tahun",
    tagline: "Mengenal agama dengan cara yang hangat dan mudah dipahami.",
    longDescription:
      "Anak belajar akidah, fiqih ibadah, akhlak, serta kisah Rasulullah ﷺ dan para sahabat melalui cerita, diskusi, dan praktik. Tujuannya menumbuhkan pemahaman sekaligus kecintaan pada Islam.",
    facts: [
      { label: "Usia", value: "7–13 tahun" },
      { label: "Durasi", value: "60 menit / pertemuan" },
      { label: "Frekuensi", value: "2× seminggu" },
      { label: "Mode", value: "Online" },
    ],
    curriculum: [
      {
        id: "dn-1",
        level: "Modul 1",
        title: "Akidah Dasar",
        duration: "8 pertemuan",
        topics: ["Rukun iman & rukun Islam", "Mengenal Allah melalui ciptaan-Nya", "Mengenal malaikat & kitab"],
      },
      {
        id: "dn-2",
        level: "Modul 2",
        title: "Fiqih Ibadah",
        duration: "10 pertemuan",
        topics: ["Thaharah & wudhu", "Tata cara shalat", "Puasa & zakat untuk anak", "Praktik langsung"],
      },
      {
        id: "dn-3",
        level: "Modul 3",
        title: "Sirah Nabawiyah",
        duration: "10 pertemuan",
        topics: ["Kelahiran & masa kecil Nabi ﷺ", "Dakwah di Makkah", "Hijrah ke Madinah", "Akhlak Rasulullah ﷺ"],
      },
      {
        id: "dn-4",
        level: "Modul 4",
        title: "Kisah Para Sahabat & Adab",
        duration: "10 pertemuan",
        topics: ["Khulafaur Rasyidin", "Sahabat & shahabiyah teladan", "Adab harian seorang Muslim"],
      },
    ],
    outcomes: [
      "Memahami dasar akidah dan ibadah sehari-hari",
      "Mampu mempraktikkan wudhu dan shalat dengan benar",
      "Mengenal kisah Nabi ﷺ dan para sahabat",
      "Terbiasa dengan adab dan akhlak Islami",
    ],
    audience: [
      { icon: "sprout", title: "Pendidikan agama sejak dini", description: "Anak yang perlu pondasi agama yang benar dan menyenangkan." },
      { icon: "heart", title: "Suka mendengar cerita", description: "Belajar sirah lewat kisah membuat nilai-nilai Islam lebih melekat." },
      { icon: "shield", title: "Sekolah umum", description: "Melengkapi pelajaran agama yang terbatas di sekolah umum." },
      { icon: "users", title: "Belajar bersama keluarga", description: "Materi bisa didiskusikan kembali oleh orang tua di rumah." },
    ],
    pricing: standardPricing(),
  },
];

export function getProgramBySlug(slug: string) {
  return programs.find((program) => program.slug === slug);
}
