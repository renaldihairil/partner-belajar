"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireDb, schema } from "@/db";
import { newId } from "@/lib/admin/form";
import { requirePermission } from "@/lib/auth/session";

const BACK = "/admin/link-testimoni";

/** Kode acak 12 karakter (huruf besar-kecil, angka, - dan _): tidak bisa ditebak. */
function newToken() {
  return randomBytes(9).toString("base64url");
}

export async function createTestimonialLinkAction(formData: FormData) {
  await requirePermission("testimoni");
  const db = await requireDb();

  const programId = String(formData.get("programId") ?? "").trim() || null;
  let programTitle: string | null = null;
  if (programId) {
    const [program] = await db
      .select({ title: schema.programs.title })
      .from(schema.programs)
      .where(eq(schema.programs.id, programId))
      .limit(1);
    if (!program) redirect(`${BACK}?pesan=program-tidak-ada`);
    programTitle = program.title;
  }
  const label = String(formData.get("label") ?? "").trim().slice(0, 80) || (programTitle ? `Orang tua ${programTitle}` : "Semua orang tua");

  await db.insert(schema.testimonialLinks).values({ id: newId("link"), token: newToken(), label, programId });
  revalidatePath(BACK);
  redirect(`${BACK}?pesan=link-dibuat`);
}

export async function toggleTestimonialLinkAction(formData: FormData) {
  await requirePermission("testimoni");
  const db = await requireDb();
  await db
    .update(schema.testimonialLinks)
    .set({ active: formData.get("active") === "on", updatedAt: new Date() })
    .where(eq(schema.testimonialLinks.id, String(formData.get("id"))));
  revalidatePath(BACK);
}

export async function deleteTestimonialLinkAction(formData: FormData) {
  await requirePermission("testimoni");
  const db = await requireDb();
  // Testimoni yang sudah masuk tetap ada (link_id otomatis dikosongkan).
  await db.delete(schema.testimonialLinks).where(eq(schema.testimonialLinks.id, String(formData.get("id"))));
  revalidatePath(BACK);
  redirect(`${BACK}?pesan=link-dihapus`);
}
