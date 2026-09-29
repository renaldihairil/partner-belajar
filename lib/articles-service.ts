import "server-only";
import { cache } from "react";
import { desc, eq } from "drizzle-orm";
import { articles as articleData } from "@/data/articles";
import { getDb, schema } from "@/db";
import type { ArticleRow } from "@/db/schema";
import type { Article } from "@/types";

/**
 * Data artikel publik: dari database bila terhubung (dikelola lewat /admin/artikel),
 * jika tidak (atau error) memakai contoh artikel di data/articles.ts.
 */

export function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    image: row.image,
    imageAlt: row.imageAlt,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags,
    author: { name: row.authorName, role: row.authorRole },
    content: row.content,
    updatedAt: row.updatedAt.toISOString(),
    featured: row.featured || undefined,
  };
}

/** Artikel yang sudah terbit, terbaru dulu. */
export const getArticles = cache(async (): Promise<Article[]> => {
  try {
    const db = await getDb();
    if (db) {
      const rows = await db.select().from(schema.articles).where(eq(schema.articles.published, true)).orderBy(desc(schema.articles.date));
      return rows.map(toArticle);
    }
  } catch (error) {
    console.error("[content] Gagal memuat artikel dari database, memakai data bawaan:", error);
  }
  return [...articleData].sort((a, b) => b.date.localeCompare(a.date));
});

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return (await getArticles()).find((article) => article.slug === slug);
}

/** Artikel terkait: kategori sama dulu, lalu yang terbaru. */
export function pickRelatedArticles(all: Article[], article: Article, limit = 3): Article[] {
  const others = all.filter((a) => a.id !== article.id);
  return [...others.filter((a) => a.category === article.category), ...others.filter((a) => a.category !== article.category)].slice(0, limit);
}
