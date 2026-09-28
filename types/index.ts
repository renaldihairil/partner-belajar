export type ProgramTheme = "blue" | "yellow" | "green" | "purple";

export type Program = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  theme: ProgramTheme;
  /** Label kategori singkat, mis. "Bahasa" atau "Agama". */
  category: string;
  /** Rentang usia peserta, mis. "6–12 tahun". */
  ageRange: string;
  /** Kode singkat untuk kode pendaftaran, mis. "EN" → PB-EN-7K3F. */
  code: string;
} & ProgramDetail;

/** Konten halaman detail program (/program/[slug]). */
export type ProgramDetail = {
  /** Kalimat hero singkat di halaman detail. */
  tagline: string;
  longDescription: string;
  /** Fakta ringkas di hero, mis. { label: "Durasi", value: "60 menit / pertemuan" }. */
  facts: { label: string; value: string }[];
  curriculum: CurriculumModule[];
  /** Hasil yang diharapkan setelah menyelesaikan program. */
  outcomes: string[];
  audience: AudienceItem[];
  pricing: PricePlan[];
};

export type CurriculumModule = {
  id: string;
  level: string;
  title: string;
  duration: string;
  topics: string[];
};

export type AudienceItem = {
  icon: "sprout" | "rocket" | "heart" | "users" | "star" | "shield";
  title: string;
  description: string;
};

export type PricePlan = {
  id: string;
  /** Mis. "1 Siswa • 1 Pengajar". */
  label: string;
  /** Harga dalam rupiah. */
  price: number;
  /** Mis. "per pertemuan" atau "per siswa / pertemuan". */
  unit: string;
  features: string[];
  popular?: boolean;
};

/** Data pendaftaran/pertanyaan yang dikirim ke /api/leads dan ke WhatsApp. */
export type LeadIntent = "daftar" | "ingatkan" | "tunggu" | "info" | "tanya";

export type Lead = {
  ref: string;
  intent: LeadIntent;
  programTitle?: string;
  className?: string;
  planLabel?: string;
  parentName: string;
  childName?: string;
  childAge?: string;
  city?: string;
  whatsapp?: string;
  source?: string;
  notes?: string;
  /** Atribusi otomatis */
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  landingPage?: string;
  pagePath?: string;
  device?: "mobile" | "desktop";
};

/** Mode pelaksanaan kelas. */
export type ClassMode = "online" | "offline" | "hybrid";

/**
 * Satu gelombang/batch kelas untuk sebuah program.
 * Bentuk ini sengaja dibuat datar & serializable (JSON) agar kelak bisa langsung
 * dikembalikan oleh API/admin panel tanpa perubahan di komponen.
 */
export type ProgramClass = {
  id: string;
  programId: string;
  name: string;
  /** Tanggal ISO "YYYY-MM-DD" (zona waktu WIB). */
  registrationOpens: string;
  registrationCloses: string;
  classStarts: string;
  /** Mis. ["Senin", "Rabu"]. */
  days: string[];
  /** Mis. "16.00 – 17.00 WIB". */
  time: string;
  mode: ClassMode;
  /** Lokasi untuk offline/hybrid. */
  location?: string;
  quota: number;
  enrolled: number;
  /** Admin dapat menutup pendaftaran secara manual sebelum tanggal tutup. */
  manuallyClosed?: boolean;
  /** Catatan tambahan, mis. "Level pemula". */
  note?: string;
};

/** Status pendaftaran yang dihitung dari tanggal + kuota (lihat lib/class-status.ts). */
export type RegistrationStatus = "open" | "upcoming" | "full" | "closed";

export type ProgramWithClasses = Program & { classes: ProgramClass[] };

export type ArticleCategory = "Tips Belajar" | "Parenting" | "Bahasa" | "Islami";

/** Blok isi artikel sederhana (frontend dulu; nanti bisa diganti Markdown/CMS). */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "tip"; text: string };

export type Article = {
  id: string;
  slug: string;
  title: string;
  /** Tanggal ISO (YYYY-MM-DD) agar bisa diurutkan & dipakai di <time>. */
  date: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  category: ArticleCategory;
  tags: string[];
  author: { name: string; role: string };
  content: ArticleBlock[];
  /** Tampilkan sebagai artikel pilihan di atas grid. */
  featured?: boolean;
};

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: "program" | "artikel" | "pengajar" | "orangtua";
  tone: "teal" | "yellow" | "blue" | "green";
};

export type Testimonial = {
  id: string;
  name: string;
  /** Mis. "Orang tua siswa English Partner". */
  role: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  tone: "teal" | "yellow" | "blue" | "green" | "purple";
  /** Program terkait (untuk filter di halaman Testimoni). */
  programId?: string;
  /** Kota orang tua. */
  city?: string;
  /** Tanggal ISO "YYYY-MM-DD". */
  date?: string;
};

export type Teacher = {
  id: string;
  name: string;
  title: string;
  programIds: string[];
  experienceYears: number;
  education: string;
  highlights: string[];
  bio: string;
  /** Untuk avatar ilustrasi faceless (berpeci / berhijab). */
  gender: "ikhwan" | "akhwat";
  /** Opsional: foto asli di /public/images/pengajar/… (menggantikan avatar ilustrasi). */
  photo?: string;
};

export type DocumentationCategory = "Kelas Online" | "Tatap Muka" | "Kegiatan Spesial";

export type DocumentationItem = {
  id: string;
  title: string;
  caption: string;
  date: string;
  category: DocumentationCategory;
  programId?: string;
  image: string;
  width: number;
  height: number;
};

export type Reason = {
  id: string;
  icon: "teacher" | "curriculum" | "islamic" | "small-class" | "report" | "schedule";
  title: string;
  description: string;
};

export type Stat = {
  id: string;
  icon: "students" | "teachers" | "sessions" | "rating";
  value: number;
  /** Jumlah angka di belakang koma, mis. 1 untuk rating 4.8. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  caption: string;
};
