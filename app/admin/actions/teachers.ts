"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDb, schema } from "@/db";
import { checkbox, formToObject, intField, newId, optionalText, requiredText, zodErrors, type ActionState } from "@/lib/admin/form";
import { moveRow, nextSortOrder } from "@/lib/admin/reorder";
import { revalidateSite } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/auth/session";
import { deleteImage } from "@/lib/storage";

const teacherSchema = z.object({
  id: z.string().optional(),
  name: requiredText("Nama", 100),
  title: requiredText("Jabatan / keahlian", 100),
  programIds: z.array(z.string()).default([]),
  experienceYears: intField("Lama mengajar", 0, 60),
  education: requiredText("Pendidikan", 150),
  highlights: z.array(z.string().max(60, "Keunggulan maksimal 60 karakter.")).max(6, "Maksimal 6 keunggulan.").default([]),
  bio: requiredText("Bio singkat", 400),
  gender: z.enum(["ikhwan", "akhwat"], { error: "Pilih ikhwan atau akhwat." }),
  photo: optionalText(500),
  published: checkbox,
});

export async function saveTeacherAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = teacherSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { id, ...values } = parsed.data;

  const db = await requireDb();
  if (id) {
    const [old] = await db.select({ photo: schema.teachers.photo }).from(schema.teachers).where(eq(schema.teachers.id, id)).limit(1);
    await db.update(schema.teachers).set({ ...values, updatedAt: new Date() }).where(eq(schema.teachers.id, id));
    if (old?.photo && old.photo !== values.photo) await deleteImage(old.photo);
  } else {
    await db.insert(schema.teachers).values({ ...values, id: newId("guru"), sortOrder: await nextSortOrder(db, schema.teachers) });
  }
  revalidateSite();
  redirect(`/admin/pengajar?pesan=${id ? "tersimpan" : "dibuat"}`);
}

export async function deleteTeacherAction(formData: FormData) {
  await requireAdmin();
  const db = await requireDb();
  const id = String(formData.get("id"));
  const [row] = await db.delete(schema.teachers).where(eq(schema.teachers.id, id)).returning({ photo: schema.teachers.photo });
  await deleteImage(row?.photo);
  revalidateSite();
  redirect("/admin/pengajar?pesan=dihapus");
}

export async function toggleTeacherAction(formData: FormData) {
  await requireAdmin();
  const db = await requireDb();
  await db
    .update(schema.teachers)
    .set({ published: formData.get("published") === "on", updatedAt: new Date() })
    .where(eq(schema.teachers.id, String(formData.get("id"))));
  revalidateSite();
  revalidatePath("/admin/pengajar");
}

export async function moveTeacherAction(formData: FormData) {
  await requireAdmin();
  const db = await requireDb();
  await moveRow(db, schema.teachers, String(formData.get("id")), formData.get("direction") === "up" ? "up" : "down");
  revalidateSite();
  revalidatePath("/admin/pengajar");
}
