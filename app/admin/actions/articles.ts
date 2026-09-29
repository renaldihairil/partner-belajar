"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDb, schema } from "@/db";
import { checkbox, formToObject, isoDate, newId, requiredText, slugify, zodErrors, type ActionState } from "@/lib/admin/form";
import { revalidateSite } from "@/lib/admin/revalidate";
import { articleCategories } from "@/lib/articles";
import { requirePermission } from "@/lib/auth/session";
import { deleteImage } from "@/lib/storage";

const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string().trim().min(1).max(3000) }),
  z.object({ type: z.literal("h2"), text: z.string().trim().min(1).max(150) }),
  z.object({ type: z.literal("tip"), text: z.string().trim().min(1).max(600) }),
  z.object({ type: z.literal("list"), items: z.array(z.string().trim().min(1).max(300)).min(1).max(30), ordered: z.boolean().optional() }),
]);

const articleSchema = z.object({
  id: z.string().optional(),
  title: requiredText("Judul", 150),
  slug: z.string().trim().max(100).optional(),
  date: isoDate("Tanggal terbit"),
  category: z.enum(articleCategories as [string, ...string[]], { error: "Pilih kategori." }),
  excerpt: requiredText("Ringkasan", 300),
  image: requiredText("Gambar sampul", 500),
  imageAlt: requiredText("Deskripsi gambar", 200),
  tags: z.array(z.string().max(40, "Tag maksimal 40 karakter.")).max(8, "Maksimal 8 tag.").default([]),
  authorName: requiredText("Nama penulis", 80),
  authorRole: requiredText("Jabatan penulis", 80),
  content: z.array(blockSchema, { error: "Isi artikel tidak valid." }).min(1, "Isi artikel wajib diisi."),
  featured: checkbox,
  published: checkbox,
});

export async function saveArticleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission("artikel");
  const parsed = articleSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { id, slug: rawSlug, category, ...rest } = parsed.data;
  const values = { ...rest, category: category as (typeof articleCategories)[number] };
  const slug = slugify(rawSlug || values.title);
  if (!slug) return { message: "Alamat (slug) tidak valid.", errors: { slug: "Gunakan huruf, angka, dan tanda hubung." } };

  const db = await requireDb();
  const [clash] = await db
    .select({ id: schema.articles.id })
    .from(schema.articles)
    .where(id ? and(eq(schema.articles.slug, slug), ne(schema.articles.id, id)) : eq(schema.articles.slug, slug))
    .limit(1);
  if (clash) return { message: "Alamat (slug) sudah dipakai artikel lain.", errors: { slug: "Sudah dipakai artikel lain." } };

  // Hanya satu artikel pilihan.
  if (values.featured && values.published) {
    await db.update(schema.articles).set({ featured: false }).where(id ? ne(schema.articles.id, id) : undefined);
  }

  if (id) {
    const [old] = await db.select({ image: schema.articles.image }).from(schema.articles).where(eq(schema.articles.id, id)).limit(1);
    await db.update(schema.articles).set({ ...values, slug, updatedAt: new Date() }).where(eq(schema.articles.id, id));
    if (old?.image && old.image !== values.image) await deleteImage(old.image);
  } else {
    await db.insert(schema.articles).values({ ...values, slug, id: newId("artikel") });
  }
  revalidateSite();
  redirect(`/admin/artikel?pesan=${id ? "tersimpan" : "dibuat"}`);
}

export async function deleteArticleAction(formData: FormData) {
  await requirePermission("artikel");
  const db = await requireDb();
  const [row] = await db.delete(schema.articles).where(eq(schema.articles.id, String(formData.get("id")))).returning({ image: schema.articles.image });
  await deleteImage(row?.image);
  revalidateSite();
  redirect("/admin/artikel?pesan=dihapus");
}

export async function toggleArticleAction(formData: FormData) {
  await requirePermission("artikel");
  const db = await requireDb();
  await db
    .update(schema.articles)
    .set({ published: formData.get("published") === "on", updatedAt: new Date() })
    .where(eq(schema.articles.id, String(formData.get("id"))));
  revalidateSite();
  revalidatePath("/admin/artikel");
}
