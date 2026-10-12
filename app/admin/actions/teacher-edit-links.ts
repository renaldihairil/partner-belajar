"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireDb, schema } from "@/db";
import { requirePermission } from "@/lib/auth/session";
import { newEditToken } from "@/lib/teacher-edit";

export type EditLinkResult = { token: string | null } | { error: string };

/**
 * Membuat link pembaruan pribadi seorang guru. Bila `reset` true, kode lama diganti
 * sehingga link yang pernah dibagikan berhenti berlaku. Tanpa `reset`, link yang sudah ada dipertahankan.
 */
export async function createTeacherEditLinkAction(id: string, reset = false): Promise<EditLinkResult> {
  await requirePermission("pengajar");
  const db = await requireDb();
  const [teacher] = await db
    .select({ editToken: schema.teachers.editToken })
    .from(schema.teachers)
    .where(eq(schema.teachers.id, id))
    .limit(1);
  if (!teacher) return { error: "Data pengajar tidak ditemukan." };
  if (teacher.editToken && !reset) return { token: teacher.editToken };

  const token = newEditToken();
  await db.update(schema.teachers).set({ editToken: token }).where(eq(schema.teachers.id, id));
  revalidatePath("/admin/pengajar");
  return { token };
}

/** Menonaktifkan link pembaruan pribadi: halamannya langsung menampilkan "tidak berlaku". */
export async function removeTeacherEditLinkAction(id: string): Promise<EditLinkResult> {
  await requirePermission("pengajar");
  const db = await requireDb();
  await db.update(schema.teachers).set({ editToken: null }).where(eq(schema.teachers.id, id));
  revalidatePath("/admin/pengajar");
  return { token: null };
}
