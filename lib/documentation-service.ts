import "server-only";
import { cache } from "react";
import { desc, eq } from "drizzle-orm";
import { documentation as documentationData } from "@/data/documentation";
import { getDb, schema } from "@/db";
import type { DocumentationRow } from "@/db/schema";
import type { DocumentationItem } from "@/types";

export function toDocumentation(row: DocumentationRow): DocumentationItem {
  return {
    id: row.id,
    title: row.title,
    caption: row.caption,
    date: row.date,
    category: row.category,
    programId: row.programId ?? undefined,
    youtubeId: row.youtubeId,
  };
}

/** Video dokumentasi yang ditampilkan, terbaru dulu. Tanpa database → contoh di data/documentation.ts. */
export const getDocumentation = cache(async (): Promise<DocumentationItem[]> => {
  try {
    const db = await getDb();
    if (db) {
      const rows = await db
        .select()
        .from(schema.documentation)
        .where(eq(schema.documentation.published, true))
        .orderBy(desc(schema.documentation.date), desc(schema.documentation.createdAt));
      return rows.map(toDocumentation);
    }
  } catch (error) {
    console.error("[content] Gagal memuat dokumentasi dari database, memakai data bawaan:", error);
  }
  return [...documentationData].sort((a, b) => b.date.localeCompare(a.date));
});
