"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDb, schema } from "@/db";
import { checkbox, formToObject, isoDate, newId, optionalText, requiredText, zodErrors, type ActionState } from "@/lib/admin/form";
import { revalidateSite } from "@/lib/admin/revalidate";
import { requirePermission } from "@/lib/auth/session";
import { deleteImage } from "@/lib/storage";
import { parseYouTubeId } from "@/lib/youtube";

const documentationCategories = ["Kelas Online", "Tatap Muka", "Kegiatan Spesial"] as const;

/**
 * Dokumentasi = video YouTube ATAU foto (16:9). Hanya salah satu yang disimpan sesuai jenisnya;
 * isian jenis lain dibuang agar tidak ada data yatim.
 */
const documentationSchema = z
  .object({
    id: z.string().optional(),
    title: requiredText("Judul", 120),
    caption: requiredText("Keterangan", 300),
    date: isoDate("Tanggal kegiatan"),
    category: z.enum(documentationCategories, { error: "Pilih kategori." }),
    programId: optionalText(100),
    mediaType: z.enum(["video", "foto"], { error: "Pilih jenis: video atau foto." }),
    url: z.string().trim().optional(),
    image: optionalText(500),
    published: checkbox,
  })
  .superRefine((v, ctx) => {
    if (v.mediaType === "video") {
      if (!v.url) ctx.addIssue({ code: "custom", path: ["url"], message: "Tautan YouTube wajib diisi." });
      else if (!parseYouTubeId(v.url))
        ctx.addIssue({ code: "custom", path: ["url"], message: "Tautan YouTube tidak valid. Contoh: https://youtu.be/abc123XYZ_0" });
    } else if (!v.image) {
      ctx.addIssue({ code: "custom", path: ["image"], message: "Foto wajib diunggah." });
    }
  });

export async function saveDocumentationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission("dokumentasi");
  const parsed = documentationSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { id, url, image, mediaType, ...rest } = parsed.data;
  const values = {
    ...rest,
    mediaType,
    youtubeId: mediaType === "video" ? parseYouTubeId(url ?? "") : null,
    image: mediaType === "foto" ? image : null,
  };

  const db = await requireDb();
  if (id) {
    const [old] = await db.select({ image: schema.documentation.image }).from(schema.documentation).where(eq(schema.documentation.id, id)).limit(1);
    await db.update(schema.documentation).set({ ...values, updatedAt: new Date() }).where(eq(schema.documentation.id, id));
    // Foto lama yang diganti (atau item diubah jadi video) tidak dipakai lagi.
    if (old?.image && old.image !== values.image) await deleteImage(old.image);
  } else {
    await db.insert(schema.documentation).values({ ...values, id: newId("dok") });
  }
  revalidateSite();
  redirect(`/admin/dokumentasi?pesan=${id ? "tersimpan" : "dibuat"}`);
}

export async function deleteDocumentationAction(formData: FormData) {
  await requirePermission("dokumentasi");
  const db = await requireDb();
  const [row] = await db
    .delete(schema.documentation)
    .where(eq(schema.documentation.id, String(formData.get("id"))))
    .returning({ image: schema.documentation.image });
  await deleteImage(row?.image);
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
