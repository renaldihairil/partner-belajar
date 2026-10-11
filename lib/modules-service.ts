import "server-only";
import { cache } from "react";
import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { LearningModuleRow } from "@/db/schema";
import type { LearningModule } from "@/types";

export function toLearningModule(row: LearningModuleRow): LearningModule {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    cover: row.cover || undefined,
    downloadUrl: row.downloadUrl,
    programId: row.programId ?? undefined,
  };
}

/** Modul belajar yang ditampilkan, sesuai urutan di admin. Tanpa database → daftar kosong. */
export const getLearningModules = cache(async (): Promise<LearningModule[]> => {
  try {
    const db = await getDb();
    if (db) {
      const rows = await db
        .select()
        .from(schema.learningModules)
        .where(eq(schema.learningModules.published, true))
        .orderBy(asc(schema.learningModules.sortOrder), asc(schema.learningModules.title));
      return rows.map(toLearningModule);
    }
  } catch (error) {
    console.error("[content] Gagal memuat modul belajar dari database:", error);
  }
  return [];
});
