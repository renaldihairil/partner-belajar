"use server";

import { and, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { formToObject, newId, zodErrors, type ActionState } from "@/lib/admin/form";
import { nextSortOrder } from "@/lib/admin/reorder";
import { verifyPassword } from "@/lib/auth/password";
import { clearAttempts, recentAttempts, recordAttempt } from "@/lib/rate-limit";
import { isOwnUploadUrl, saveImage } from "@/lib/storage";
import { getTeacherFormAccess, grantTeacherFormAccess, loadTeacherLink, teacherFormPath } from "@/lib/teacher-form";
import { visitorHash } from "@/lib/visitor";

/** PIN: 5 salah per perangkat & 20 salah per link dalam 15 menit (mencegah tebak-tebakan PIN). */
const PIN_WINDOW_MS = 15 * 60 * 1000;
const PIN_MAX_PER_VISITOR = 5;
const PIN_MAX_PER_LINK = 20;

/** Pengiriman data & unggah foto: cukup longgar untuk satu sekolah yang memakai jaringan yang sama. */
const SUBMIT_WINDOW_MS = 30 * 60 * 1000;
const SUBMIT_MAX = 8;
const UPLOAD_MAX = 12;

const PIN_PATTERN = /^\d{4,8}$/;

const NOT_FOUND = "Link ini tidak dikenali. Mohon minta link baru dari admin.";
const INACTIVE = "Link ini sudah tidak aktif. Mohon minta link baru dari admin.";
const EXPIRED = "Sesi PIN sudah berakhir. Muat ulang halaman, lalu masukkan PIN lagi.";

// ---------- PIN ----------

export async function verifyTeacherPinAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const token = String(formData.get("token") ?? "");
  const pin = String(formData.get("pin") ?? "").trim();
  if (!PIN_PATTERN.test(pin)) return { message: "PIN terdiri dari 4 sampai 8 angka." };

  const db = await getDb().catch(() => null);
  if (!db) return { message: "Layanan sedang tidak tersedia. Silakan coba lagi nanti." };
  const link = await loadTeacherLink(token);
  if (!link) return { message: NOT_FOUND };
  if (!link.active) return { message: INACTIVE };
  // Link terbuka (tanpa PIN): tidak ada yang perlu diverifikasi.
  if (!link.pinHash) redirect(teacherFormPath(token));

  const visitorKey = `pin:${token}:${await visitorHash()}`;
  const linkKey = `pin:${token}`;
  const [byVisitor, byLink] = await Promise.all([
    recentAttempts(db, visitorKey, PIN_WINDOW_MS),
    recentAttempts(db, linkKey, PIN_WINDOW_MS),
  ]);
  if (byVisitor >= PIN_MAX_PER_VISITOR || byLink >= PIN_MAX_PER_LINK) {
    return { message: "Terlalu banyak percobaan PIN yang salah. Silakan coba lagi dalam 15 menit." };
  }

  if (!(await verifyPassword(pin, link.pinHash))) {
    await recordAttempt(db, visitorKey, linkKey);
    const left = PIN_MAX_PER_VISITOR - (byVisitor + 1);
    return {
      message: left > 0 ? `PIN salah. Sisa percobaan: ${left}.` : "PIN salah. Terlalu banyak percobaan, silakan coba lagi dalam 15 menit.",
    };
  }

  await clearAttempts(db, visitorKey);
  await grantTeacherFormAccess(link);
  redirect(teacherFormPath(token));
}

// ---------- Foto ----------

export type TeacherPhotoResult = { url: string } | { error: string };

export async function uploadTeacherPhotoAction(formData: FormData): Promise<TeacherPhotoResult> {
  const token = String(formData.get("token") ?? "");
  const { link, unlocked } = await getTeacherFormAccess(token);
  if (!link) return { error: NOT_FOUND };
  if (!link.active) return { error: INACTIVE };
  if (!unlocked) return { error: EXPIRED };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Pilih foto terlebih dahulu." };

  const db = await getDb().catch(() => null);
  if (!db) return { error: "Layanan sedang tidak tersedia. Silakan coba lagi nanti." };
  const key = `guru-foto:${await visitorHash()}`;
  if ((await recentAttempts(db, key, SUBMIT_WINDOW_MS)) >= UPLOAD_MAX) {
    return { error: "Terlalu banyak unggahan dalam waktu singkat. Silakan coba lagi nanti." };
  }

  try {
    const saved = await saveImage(file, "pengajar");
    await recordAttempt(db, key);
    return { url: saved.url };
  } catch (error) {
    console.error("[form-guru] unggah foto gagal", error);
    return { error: error instanceof Error ? error.message : "Gagal mengunggah foto." };
  }
}

// ---------- Data guru ----------

const clean = (value: string) => value.replace(/\s+/g, " ").trim();

const line = (label: string, min: number, max: number) =>
  z
    .string({ error: `${label} wajib diisi.` })
    .transform(clean)
    .pipe(z.string().min(min, `${label} wajib diisi.`).max(max, `${label} terlalu panjang (maks. ${max} karakter).`));

const teacherSchema = z.object({
  token: z.string().min(6).max(64),
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
    .pipe(z.string().min(20, "Bio singkat minimal 20 karakter.").max(400, "Bio singkat terlalu panjang (maks. 400 karakter).")),
  // Satu keunggulan per baris, maksimal 6, masing-masing maksimal 60 karakter.
  highlights: z
    .string()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split("\n")
        .map(clean)
        .filter(Boolean),
    )
    .pipe(z.array(z.string().max(60, "Setiap keunggulan maksimal 60 karakter.")).max(6, "Maksimal 6 keunggulan.")),
  website: z.string().optional(), // kolom jebakan robot
});

export async function submitTeacherAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = teacherSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { token, website, ...data } = parsed.data;

  const { link, unlocked } = await getTeacherFormAccess(token);
  if (!link) return { message: NOT_FOUND };
  if (!link.active) return { message: INACTIVE };
  if (!unlocked) return { message: EXPIRED };

  // Robot mengisi kolom jebakan. Pura-pura berhasil agar tidak mencoba lagi.
  if (website) return { ok: true };

  const db = await getDb().catch(() => null);
  if (!db) return { message: "Layanan sedang tidak tersedia. Silakan coba lagi nanti." };

  const key = `guru:${await visitorHash()}`;
  if ((await recentAttempts(db, key, SUBMIT_WINDOW_MS)) >= SUBMIT_MAX) {
    return { message: "Terlalu banyak kiriman dalam waktu singkat. Silakan coba lagi nanti." };
  }

  // Foto hanya boleh hasil unggahan lewat form ini (bukan URL sembarang).
  if (data.photo && !isOwnUploadUrl(data.photo, "pengajar")) {
    return { message: "Periksa kembali isian yang ditandai.", errors: { photo: "Foto tidak valid. Silakan unggah ulang." } };
  }

  // Program harus benar-benar ada.
  const valid = await db.select({ id: schema.programs.id }).from(schema.programs).where(inArray(schema.programs.id, data.programIds));
  const programIds = valid.map((p) => p.id);
  if (programIds.length === 0) return { message: "Periksa kembali isian yang ditandai.", errors: { programIds: "Pilih minimal satu program." } };

  // Klik "Kirim" dua kali: jangan simpan dua kali.
  const [duplicate] = await db
    .select({ id: schema.teachers.id })
    .from(schema.teachers)
    .where(and(eq(schema.teachers.linkId, link.id), eq(schema.teachers.name, data.name), eq(schema.teachers.bio, data.bio)))
    .limit(1);
  if (duplicate) return { ok: true };

  // Masuk sebagai draf (disembunyikan): admin meninjau dulu sebelum menampilkannya di situs.
  await db.insert(schema.teachers).values({
    id: newId("guru"),
    name: data.name,
    title: data.title,
    programIds,
    experienceYears: data.experienceYears,
    education: data.education,
    highlights: data.highlights,
    bio: data.bio,
    gender: data.gender,
    photo: data.photo,
    contact: data.contact,
    linkId: link.id,
    sortOrder: await nextSortOrder(db, schema.teachers),
    published: false,
  });
  await recordAttempt(db, key);

  return { ok: true };
}
