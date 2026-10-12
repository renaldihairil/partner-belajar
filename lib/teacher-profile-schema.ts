import { z } from "zod";

/**
 * Isian profil guru yang sama untuk form link (guru baru) dan form pembaruan pribadi.
 *
 * Bio dan keunggulan tidak dibatasi panjangnya di tampilan. Batas di bawah hanya pagar pengaman
 * server agar formulir publik tidak bisa dipakai mengirim data berukuran tak wajar.
 */
const SAFETY_BIO = 20_000;
const SAFETY_HIGHLIGHT = 500;
const SAFETY_HIGHLIGHT_COUNT = 50;

export const clean = (value: string) => value.replace(/\s+/g, " ").trim();

const line = (label: string, min: number, max: number) =>
  z
    .string({ error: `${label} wajib diisi.` })
    .transform(clean)
    .pipe(z.string().min(min, `${label} wajib diisi.`).max(max, `${label} terlalu panjang (maks. ${max} karakter).`));

export const teacherProfileFields = {
  name: line("Nama lengkap", 3, 100),
  gender: z.enum(["ikhwan", "akhwat"], { error: "Pilih ikhwan atau akhwat." }),
  contact: z
    .string()
    .transform(clean)
    .pipe(z.string().max(100, "Kontak terlalu panjang (maks. 100 karakter)."))
    .optional()
    .transform((v) => v || null),
  photo: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || null),
  // Tanpa centang apa pun, browser tidak mengirim kolom ini sama sekali.
  programIds: z
    .array(z.string())
    .optional()
    .transform((v) => v ?? [])
    .pipe(z.array(z.string()).min(1, "Pilih minimal satu program.").max(10, "Terlalu banyak program dipilih.")),
  title: line("Jabatan / keahlian", 3, 100),
  // Opsional: bila kosong disimpan sebagai teks kosong.
  education: z
    .string()
    .transform(clean)
    .pipe(z.string().max(150, "Pendidikan terlalu panjang (maks. 150 karakter)."))
    .optional()
    .transform((v) => v ?? ""),
  experienceYears: z.coerce
    .number({ error: "Lama mengajar harus berupa angka." })
    .int("Lama mengajar harus bilangan bulat.")
    .min(0, "Lama mengajar minimal 0 tahun.")
    .max(60, "Lama mengajar maksimal 60 tahun."),
  bio: z
    .string({ error: "Bio singkat wajib diisi." })
    .transform((v) => v.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim())
    .pipe(z.string().min(20, "Bio singkat minimal 20 karakter.").max(SAFETY_BIO, "Bio terlalu panjang.")),
  // Dikirim form sebagai `highlights_json` (daftar, satu isian per keunggulan); isian kosong dibuang.
  highlights: z
    .array(z.string())
    .optional()
    .transform((v) => (v ?? []).map(clean).filter(Boolean))
    .pipe(
      z
        .array(z.string().max(SAFETY_HIGHLIGHT, "Salah satu keunggulan terlalu panjang."))
        .max(SAFETY_HIGHLIGHT_COUNT, "Terlalu banyak keunggulan."),
    ),
};

export const teacherProfileSchema = z.object(teacherProfileFields);
export type TeacherProfileInput = z.infer<typeof teacherProfileSchema>;
