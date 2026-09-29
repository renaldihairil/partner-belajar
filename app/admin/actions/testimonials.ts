"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDb, schema } from "@/db";
import { checkbox, formToObject, newId, optionalText, requiredText, zodErrors, type ActionState } from "@/lib/admin/form";
import { moveRow, nextSortOrder } from "@/lib/admin/reorder";
import { revalidateSite } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/auth/session";

const TONES = ["teal", "yellow", "blue", "green", "purple"] as const;

const testimonialSchema = z.object({
  id: z.string().optional(),
  name: requiredText("Nama", 80),
  role: requiredText("Keterangan", 120),
  quote: requiredText("Isi testimoni", 600),
  rating: z.coerce.number().int().min(1, "Pilih rating.").max(5),
  tone: z.enum(TONES),
  programId: optionalText(60),
  city: optionalText(80),
  date: z
    .string()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), "Format tanggal tidak valid."),
  published: checkbox,
});

export async function saveTestimonialAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { id, rating, ...data } = parsed.data;
  const values = { ...data, rating: rating as 1 | 2 | 3 | 4 | 5 };

  const db = await requireDb();
  if (id) {
    await db.update(schema.testimonials).set({ ...values, updatedAt: new Date() }).where(eq(schema.testimonials.id, id));
  } else {
    await db.insert(schema.testimonials).values({
      ...values,
      id: newId("t"),
      sortOrder: await nextSortOrder(db, schema.testimonials),
    });
  }
  revalidateSite();
  redirect(`/admin/testimoni?pesan=${id ? "tersimpan" : "dibuat"}`);
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();
  const db = await requireDb();
  await db.delete(schema.testimonials).where(eq(schema.testimonials.id, String(formData.get("id"))));
  revalidateSite();
  redirect("/admin/testimoni?pesan=dihapus");
}

export async function toggleTestimonialAction(formData: FormData) {
  await requireAdmin();
  const db = await requireDb();
  await db
    .update(schema.testimonials)
    .set({ published: formData.get("published") === "on", updatedAt: new Date() })
    .where(eq(schema.testimonials.id, String(formData.get("id"))));
  revalidateSite();
  revalidatePath("/admin/testimoni");
}

export async function moveTestimonialAction(formData: FormData) {
  await requireAdmin();
  const db = await requireDb();
  await moveRow(db, schema.testimonials, String(formData.get("id")), formData.get("direction") === "up" ? "up" : "down");
  revalidateSite();
  revalidatePath("/admin/testimoni");
}
