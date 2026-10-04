"use server";

import { createHash } from "node:crypto";
import { and, count, eq, gte, min } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { formToObject, newId, zodErrors, type ActionState } from "@/lib/admin/form";
import { revalidateSite } from "@/lib/admin/revalidate";

/** Batas kiriman per perangkat: cukup longgar untuk satu keluarga / jaringan seluler bersama. */
const MAX_PER_WINDOW = 6;
const WINDOW_MS = 30 * 60 * 1000;

// Tautan / promosi tidak diizinkan di testimoni publik (pencegah spam paling umum).
const LINK_PATTERN = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|xyz|me|ly|link|shop|site|online)\b)/i;

const clean = (value: string) => value.replace(/\s+/g, " ").trim();

const text = (label: string, max: number) =>
  z
    .string({ error: `${label} wajib diisi.` })
    .transform(clean)
    .pipe(
      z
        .string()
        .min(2, `${label} wajib diisi.`)
        .max(max, `${label} terlalu panjang (maks. ${max} karakter).`)
        .refine((v) => !LINK_PATTERN.test(v), "Mohon tidak menyertakan tautan."),
    );

const submitSchema = z.object({
  token: z.string().min(6).max(64),
  parent: text("Nama wali", 60),
  child: text("Nama anak", 60),
  quote: z
    .string({ error: "Testimoni wajib diisi." })
    .transform((v) => v.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim())
    .pipe(
      z
        .string()
        .min(15, "Tulis testimoni minimal 15 karakter.")
        .max(600, "Testimoni terlalu panjang (maks. 600 karakter).")
        .refine((v) => !LINK_PATTERN.test(v), "Mohon tidak menyertakan tautan."),
    ),
  rating: z.coerce.number({ error: "Pilih jumlah bintang." }).int().min(1, "Pilih jumlah bintang.").max(5, "Pilih jumlah bintang."),
  website: z.string().optional(), // honeypot: manusia tidak mengisinya
});

const themeToTone = { blue: "blue", yellow: "yellow", green: "green", purple: "purple" } as const;

/** Identitas perangkat yang di-hash (alamat IP asli tidak disimpan). */
async function visitorKey(): Promise<string> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
  const salt = process.env.AUTH_SECRET || "partner-belajar";
  return `testimoni:${createHash("sha256").update(`${salt}|${ip}`).digest("hex").slice(0, 24)}`;
}

function todayWib(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });
}

/** Menerima testimoni dari orang tua lewat link publik dan langsung menampilkannya di situs. */
export async function submitTestimonialAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = submitSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { token, parent, child, quote, rating, website } = parsed.data;

  // Robot biasanya mengisi semua kolom. Pura-pura berhasil agar tidak mencoba lagi.
  if (website) return { ok: true };

  const db = await getDb();
  if (!db) return { message: "Layanan sedang tidak tersedia. Silakan coba lagi nanti." };

  const [link] = await db.select().from(schema.testimonialLinks).where(eq(schema.testimonialLinks.token, token)).limit(1);
  if (!link) return { message: "Link ini tidak dikenali. Mohon minta link baru dari admin." };
  if (!link.active) return { message: "Link ini sudah tidak aktif. Mohon minta link baru dari admin." };

  // Batasi kiriman beruntun dari perangkat yang sama.
  const key = await visitorKey();
  const since = new Date(Date.now() - WINDOW_MS);
  const [{ value: recent }] = await db
    .select({ value: count() })
    .from(schema.loginAttempts)
    .where(and(eq(schema.loginAttempts.key, key), gte(schema.loginAttempts.createdAt, since)));
  if (recent >= MAX_PER_WINDOW) return { message: "Terlalu banyak kiriman dalam waktu singkat. Silakan coba lagi nanti." };

  // Klik "Kirim" dua kali / halaman dimuat ulang: jangan simpan dua kali.
  const [duplicate] = await db
    .select({ id: schema.testimonials.id })
    .from(schema.testimonials)
    .where(and(eq(schema.testimonials.linkId, link.id), eq(schema.testimonials.name, parent), eq(schema.testimonials.quote, quote)))
    .limit(1);
  if (duplicate) return { ok: true };

  let tone: "teal" | "yellow" | "blue" | "green" | "purple" = "teal";
  let programTitle: string | null = null;
  if (link.programId) {
    const [program] = await db
      .select({ title: schema.programs.title, theme: schema.programs.theme })
      .from(schema.programs)
      .where(eq(schema.programs.id, link.programId))
      .limit(1);
    if (program) {
      tone = themeToTone[program.theme] ?? "teal";
      programTitle = program.title;
    }
  }

  // Testimoni terbaru tampil paling depan (urutan terkecil).
  const [{ value: lowest }] = await db.select({ value: min(schema.testimonials.sortOrder) }).from(schema.testimonials);

  await db.insert(schema.testimonials).values({
    id: newId("t"),
    name: parent,
    childName: child,
    role: programTitle ? `Orang tua dari ${child} · ${programTitle}` : `Orang tua dari ${child}`,
    quote,
    rating: rating as 1 | 2 | 3 | 4 | 5,
    tone,
    programId: link.programId,
    date: todayWib(),
    linkId: link.id,
    sortOrder: (lowest ?? 0) - 1,
    published: true,
  });
  await db.insert(schema.loginAttempts).values({ key });

  revalidateSite();
  return { ok: true };
}
