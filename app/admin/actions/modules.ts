"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDb, schema } from "@/db";
import { checkbox, formToObject, newId, optionalText, requiredText, zodErrors, type ActionState } from "@/lib/admin/form";
import { moveRow, nextSortOrder } from "@/lib/admin/reorder";
import { revalidateSite } from "@/lib/admin/revalidate";
import { requirePermission } from "@/lib/auth/session";
import { deleteImage } from "@/lib/storage";

/** Tautan unduh: boleh ditulis tanpa "https://"; hanya http/https yang diterima (menolak javascript:, data:, dll.). */
const downloadUrl = z
  .string({ error: "Tautan unduh wajib diisi." })
  .trim()
  .min(1, "Tautan unduh wajib diisi.")
  .max(1000, "Tautan terlalu panjang (maks. 1000 karakter).")
  .transform((value, ctx) => {
    const candidate = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
    try {
      const url = new URL(candidate);
      if ((url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".")) return url.toString();
    } catch {
      // jatuh ke pesan galat di bawah
    }
    ctx.addIssue({ code: "custom", message: "Tautan tidak valid. Contoh: https://drive.google.com/file/d/..." });
    return value;
  });

const moduleSchema = z.object({
  id: z.string().optional(),
  title: requiredText("Nama kitab", 120),
  description: requiredText("Deskripsi singkat", 300),
  cover: optionalText(500),
  downloadUrl,
  programId: optionalText(100),
  published: checkbox,
});

export async function saveModuleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission("modul");
  const parsed = moduleSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { id, ...values } = parsed.data;

  const db = await requireDb();
  if (id) {
    const [old] = await db
      .select({ cover: schema.learningModules.cover })
      .from(schema.learningModules)
      .where(eq(schema.learningModules.id, id))
      .limit(1);
    await db.update(schema.learningModules).set({ ...values, updatedAt: new Date() }).where(eq(schema.learningModules.id, id));
    if (old?.cover && old.cover !== values.cover) await deleteImage(old.cover);
  } else {
    await db
      .insert(schema.learningModules)
      .values({ ...values, id: newId("modul"), sortOrder: await nextSortOrder(db, schema.learningModules) });
  }
  revalidateSite();
  redirect(`/admin/modul?pesan=${id ? "tersimpan" : "dibuat"}`);
}

export async function deleteModuleAction(formData: FormData) {
  await requirePermission("modul");
  const db = await requireDb();
  const id = String(formData.get("id"));
  const [row] = await db
    .delete(schema.learningModules)
    .where(eq(schema.learningModules.id, id))
    .returning({ cover: schema.learningModules.cover });
  await deleteImage(row?.cover);
  revalidateSite();
  redirect("/admin/modul?pesan=dihapus");
}

export async function toggleModuleAction(formData: FormData) {
  await requirePermission("modul");
  const db = await requireDb();
  await db
    .update(schema.learningModules)
    .set({ published: formData.get("published") === "on", updatedAt: new Date() })
    .where(eq(schema.learningModules.id, String(formData.get("id"))));
  revalidateSite();
  revalidatePath("/admin/modul");
}

export async function moveModuleAction(formData: FormData) {
  await requirePermission("modul");
  const db = await requireDb();
  await moveRow(db, schema.learningModules, String(formData.get("id")), formData.get("direction") === "up" ? "up" : "down");
  revalidateSite();
  revalidatePath("/admin/modul");
}
