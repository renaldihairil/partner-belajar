"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { formToObject, zodErrors, type ActionState } from "@/lib/admin/form";
import { revalidateSite } from "@/lib/admin/revalidate";
import { recentAttempts, recordAttempt } from "@/lib/rate-limit";
import { deleteImage, isOwnUploadUrl, saveImage } from "@/lib/storage";
import { loadTeacherByEditToken } from "@/lib/teacher-edit";
import { teacherProfileFields } from "@/lib/teacher-profile-schema";
import { visitorHash } from "@/lib/visitor";

/** Cukup longgar untuk guru yang membenahi isian berkali-kali, tetapi menahan robot. */
const WINDOW_MS = 30 * 60 * 1000;
const SAVE_MAX = 20;
const UPLOAD_MAX = 12;

const NOT_VALID = "Link ini sudah tidak berlaku. Mohon minta link baru dari admin.";

export type ProfilePhotoResult = { url: string } | { error: string };

export async function uploadProfilePhotoAction(formData: FormData): Promise<ProfilePhotoResult> {
  const teacher = await loadTeacherByEditToken(String(formData.get("token") ?? ""));
  if (!teacher) return { error: NOT_VALID };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Pilih foto terlebih dahulu." };

  const db = await getDb().catch(() => null);
  if (!db) return { error: "Layanan sedang tidak tersedia. Silakan coba lagi nanti." };
  const key = `profil-foto:${await visitorHash()}`;
  if ((await recentAttempts(db, key, WINDOW_MS)) >= UPLOAD_MAX) {
    return { error: "Terlalu banyak unggahan dalam waktu singkat. Silakan coba lagi nanti." };
  }

  try {
    const saved = await saveImage(file, "pengajar");
    await recordAttempt(db, key);
    return { url: saved.url };
  } catch (error) {
    console.error("[profil-guru] unggah foto gagal", error);
    return { error: error instanceof Error ? error.message : "Gagal mengunggah foto." };
  }
}

const profileSchema = z.object({
  token: z.string().min(6).max(64),
  ...teacherProfileFields,
  website: z.string().optional(), // kolom jebakan robot
});

/** Guru memperbarui data dirinya sendiri. Berlaku langsung; status tampil/sembunyi dan urutan tidak berubah. */
export async function updateTeacherProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = profileSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { token, website, ...data } = parsed.data;

  const teacher = await loadTeacherByEditToken(token);
  if (!teacher) return { message: NOT_VALID };

  // Robot mengisi kolom jebakan. Pura-pura berhasil agar tidak mencoba lagi.
  if (website) return { ok: true };

  const db = await getDb().catch(() => null);
  if (!db) return { message: "Layanan sedang tidak tersedia. Silakan coba lagi nanti." };

  const key = `profil:${await visitorHash()}`;
  if ((await recentAttempts(db, key, WINDOW_MS)) >= SAVE_MAX) {
    return { message: "Terlalu banyak penyimpanan dalam waktu singkat. Silakan coba lagi nanti." };
  }

  // Foto: boleh foto saat ini, atau hasil unggahan baru lewat form (bukan URL sembarang).
  if (data.photo && data.photo !== teacher.photo && !isOwnUploadUrl(data.photo, "pengajar")) {
    return { message: "Periksa kembali isian yang ditandai.", errors: { photo: "Foto tidak valid. Silakan unggah ulang." } };
  }

  const valid = await db.select({ id: schema.programs.id }).from(schema.programs).where(inArray(schema.programs.id, data.programIds));
  const programIds = valid.map((p) => p.id);
  if (programIds.length === 0) return { message: "Periksa kembali isian yang ditandai.", errors: { programIds: "Pilih minimal satu program." } };

  await db
    .update(schema.teachers)
    .set({
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
      selfUpdatedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schema.teachers.id, teacher.id));
  await recordAttempt(db, key);

  // Foto lama yang diganti tidak dipakai lagi.
  if (teacher.photo && teacher.photo !== data.photo) await deleteImage(teacher.photo);

  revalidateSite();
  revalidatePath("/admin/pengajar");
  return { ok: true };
}
