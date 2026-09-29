"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDb, schema } from "@/db";
import { checkbox, formToObject, intField, newId, requiredText, slugify, zodErrors, type ActionState } from "@/lib/admin/form";
import { moveRow, nextSortOrder } from "@/lib/admin/reorder";
import { revalidateSite } from "@/lib/admin/revalidate";
import { requirePermission } from "@/lib/auth/session";
import { deleteImage } from "@/lib/storage";

const text = (label: string, max = 200) => z.string({ error: `${label} wajib diisi.` }).trim().min(1, `${label} wajib diisi.`).max(max);
const lines = z.array(z.string().trim().min(1)).default([]);
const shortId = () => Math.random().toString(36).slice(2, 8);

const programSchema = z.object({
  id: z.string().optional(),
  title: requiredText("Nama program", 80),
  slug: z.string().trim().max(80).optional(),
  category: requiredText("Kategori", 40),
  ageRange: requiredText("Rentang usia", 40),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2,3}$/, "Kode 2 sampai 3 huruf, mis. EN."),
  theme: z.enum(["blue", "yellow", "green", "purple"]),
  image: z.string({ error: "Gambar program wajib diunggah." }).trim().min(1, "Gambar program wajib diunggah."),
  imageAlt: requiredText("Deskripsi gambar", 160),
  description: requiredText("Deskripsi singkat", 220),
  tagline: requiredText("Tagline", 200),
  longDescription: requiredText("Deskripsi lengkap", 1500),
  facts: z.array(z.object({ label: text("Label fakta", 40), value: text("Isi fakta", 80) })).max(6, "Maksimal 6 fakta.").default([]),
  curriculum: z
    .array(
      z.object({
        id: z.string().optional(),
        level: text("Level modul", 40),
        title: text("Judul modul", 100),
        duration: text("Durasi modul", 60),
        topics: lines,
      }),
    )
    .default([]),
  outcomes: lines,
  audience: z
    .array(
      z.object({
        icon: z.enum(["sprout", "rocket", "heart", "users", "star", "shield"]),
        title: text("Judul", 80),
        description: text("Deskripsi", 240),
      }),
    )
    .default([]),
  pricing: z
    .array(
      z.object({
        id: z.string().optional(),
        label: text("Nama paket", 60),
        price: z.coerce.number({ error: "Harga harus angka." }).int("Harga harus angka bulat.").min(0, "Harga tidak boleh negatif."),
        unit: text("Satuan harga", 60),
        features: lines,
        popular: z.boolean().optional(),
      }),
    )
    .default([]),
  published: checkbox,
});

export async function saveProgramAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission("program");
  const parsed = programSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { id, slug: rawSlug, ...data } = parsed.data;
  const slug = slugify(rawSlug || data.title);
  if (!slug) return { message: "Alamat halaman (slug) tidak valid.", errors: { slug: "Isi dengan huruf/angka." } };

  const values = {
    ...data,
    slug,
    curriculum: data.curriculum.map((m) => ({ ...m, id: m.id || `m-${shortId()}` })),
    pricing: data.pricing.map((p) => ({ ...p, id: p.id || `p-${shortId()}`, popular: p.popular || undefined })),
  };

  const db = await requireDb();
  const clash = await db
    .select({ id: schema.programs.id })
    .from(schema.programs)
    .where(id ? and(eq(schema.programs.slug, slug), ne(schema.programs.id, id)) : eq(schema.programs.slug, slug))
    .limit(1);
  if (clash.length) return { message: "Alamat halaman sudah dipakai program lain.", errors: { slug: "Sudah dipakai, gunakan alamat lain." } };

  if (id) {
    const [old] = await db.select({ image: schema.programs.image }).from(schema.programs).where(eq(schema.programs.id, id)).limit(1);
    await db.update(schema.programs).set({ ...values, updatedAt: new Date() }).where(eq(schema.programs.id, id));
    if (old?.image && old.image !== values.image) await deleteImage(old.image);
    revalidateSite();
    return { ok: true, message: "Perubahan program tersimpan dan sudah tampil di situs." };
  }

  const taken = await db.select({ id: schema.programs.id }).from(schema.programs).where(eq(schema.programs.id, slug)).limit(1);
  const newProgramId = taken.length ? newId("prog") : slug;
  await db.insert(schema.programs).values({ ...values, id: newProgramId, sortOrder: await nextSortOrder(db, schema.programs) });
  revalidateSite();
  redirect(`/admin/program/${newProgramId}?pesan=dibuat`);
}

export async function deleteProgramAction(formData: FormData) {
  await requirePermission("program");
  const db = await requireDb();
  const [row] = await db
    .delete(schema.programs)
    .where(eq(schema.programs.id, String(formData.get("id"))))
    .returning({ image: schema.programs.image });
  await deleteImage(row?.image);
  revalidateSite();
  redirect("/admin/program?pesan=dihapus");
}

export async function toggleProgramAction(formData: FormData) {
  await requirePermission("program");
  const db = await requireDb();
  await db
    .update(schema.programs)
    .set({ published: formData.get("published") === "on", updatedAt: new Date() })
    .where(eq(schema.programs.id, String(formData.get("id"))));
  revalidateSite();
  revalidatePath("/admin/program");
}

export async function moveProgramAction(formData: FormData) {
  await requirePermission("program");
  const db = await requireDb();
  await moveRow(db, schema.programs, String(formData.get("id")), formData.get("direction") === "up" ? "up" : "down");
  revalidateSite();
  revalidatePath("/admin/program");
}

// ---------- Jadwal kelas ----------

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"] as const;
const isoDate = (label: string) => z.string({ error: `${label} wajib diisi.` }).regex(/^\d{4}-\d{2}-\d{2}$/, `${label} wajib diisi.`);
const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || null);

const classSchema = z
  .object({
    id: z.string().optional(),
    programId: z.string().min(1),
    name: requiredText("Nama kelas", 80),
    registrationOpens: isoDate("Tanggal buka pendaftaran"),
    registrationCloses: isoDate("Tanggal tutup pendaftaran"),
    classStarts: isoDate("Tanggal mulai kelas"),
    days: z.array(z.enum(DAYS)).min(1, "Pilih minimal satu hari.").default([]),
    time: requiredText("Jam kelas", 40),
    mode: z.enum(["online", "offline", "hybrid"]),
    location: optionalTrimmed(160),
    quota: intField("Kuota", 1, 1000),
    enrolled: intField("Jumlah pendaftar", 0, 1000),
    manuallyClosed: checkbox,
    note: optionalTrimmed(200),
  })
  .superRefine((v, ctx) => {
    if (v.registrationCloses < v.registrationOpens)
      ctx.addIssue({ code: "custom", path: ["registrationCloses"], message: "Tanggal tutup harus setelah tanggal buka." });
    if (v.classStarts < v.registrationOpens)
      ctx.addIssue({ code: "custom", path: ["classStarts"], message: "Kelas mulai harus setelah pendaftaran dibuka." });
    if (v.enrolled > v.quota) ctx.addIssue({ code: "custom", path: ["enrolled"], message: "Jumlah pendaftar melebihi kuota." });
    if (v.mode !== "online" && !v.location) ctx.addIssue({ code: "custom", path: ["location"], message: "Isi lokasi untuk kelas tatap muka." });
  });

export async function saveClassAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission("program");
  const parsed = classSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { id, ...values } = parsed.data;
  const ordered = { ...values, days: DAYS.filter((d) => values.days.includes(d)) };

  const db = await requireDb();
  if (id) {
    await db.update(schema.programClasses).set({ ...ordered, updatedAt: new Date() }).where(eq(schema.programClasses.id, id));
  } else {
    await db.insert(schema.programClasses).values({ ...ordered, id: newId(`${values.programId}-kelas`) });
  }
  revalidateSite();
  redirect(`/admin/program/${values.programId}/kelas?pesan=${id ? "tersimpan" : "dibuat"}`);
}

export async function deleteClassAction(formData: FormData) {
  await requirePermission("program");
  const db = await requireDb();
  const [row] = await db
    .delete(schema.programClasses)
    .where(eq(schema.programClasses.id, String(formData.get("id"))))
    .returning({ programId: schema.programClasses.programId });
  revalidateSite();
  redirect(`/admin/program/${row?.programId ?? ""}/kelas?pesan=dihapus`);
}
