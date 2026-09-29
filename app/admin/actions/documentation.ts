"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDb, schema } from "@/db";
import { checkbox, formToObject, isoDate, newId, optionalText, requiredText, zodErrors, type ActionState } from "@/lib/admin/form";
import { revalidateSite } from "@/lib/admin/revalidate";
import { requirePermission } from "@/lib/auth/session";
import { parseYouTubeId } from "@/lib/youtube";

const documentationCategories = ["Kelas Online", "Tatap Muka", "Kegiatan Spesial"] as const;

const documentationSchema = z.object({
  id: z.string().optional(),
  title: requiredText("Judul", 120),
  caption: requiredText("Keterangan", 300),
  date: isoDate("Tanggal kegiatan"),
  category: z.enum(documentationCategories, { error: "Pilih kategori." }),
  programId: optionalText(100),
  url: z
    .string({ error: "Tautan YouTube wajib diisi." })
    .trim()
    .min(1, "Tautan YouTube wajib diisi.")
    .transform((value, ctx) => {
      const id = parseYouTubeId(value);
      if (!id) ctx.addIssue({ code: "custom", message: "Tautan YouTube tidak valid. Contoh: https://youtu.be/abc123XYZ_0" });
      return id ?? "";
    }),
  published: checkbox,
});

export async function saveDocumentationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission("dokumentasi");
  const parsed = documentationSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { id, url, ...rest } = parsed.data;
  const values = { ...rest, youtubeId: url };

  const db = await requireDb();
  if (id) {
    await db.update(schema.documentation).set({ ...values, updatedAt: new Date() }).where(eq(schema.documentation.id, id));
  } else {
    await db.insert(schema.documentation).values({ ...values, id: newId("dok") });
  }
  revalidateSite();
  redirect(`/admin/dokumentasi?pesan=${id ? "tersimpan" : "dibuat"}`);
}

export async function deleteDocumentationAction(formData: FormData) {
  await requirePermission("dokumentasi");
  const db = await requireDb();
  await db.delete(schema.documentation).where(eq(schema.documentation.id, String(formData.get("id"))));
  revalidateSite();
  redirect("/admin/dokumentasi?pesan=dihapus");
}

export async function toggleDocumentationAction(formData: FormData) {
  await requirePermission("dokumentasi");
  const db = await requireDb();
  await db
    .update(schema.documentation)
    .set({ published: formData.get("published") === "on", updatedAt: new Date() })
    .where(eq(schema.documentation.id, String(formData.get("id"))));
  revalidateSite();
  revalidatePath("/admin/dokumentasi");
}
