import "server-only";
import { asc } from "drizzle-orm";
import { requireDb, schema } from "@/db";

/** Pilihan program untuk dropdown admin (semua program, termasuk yang disembunyikan). */
export async function programOptions() {
  const db = await requireDb();
  const rows = await db
    .select({ id: schema.programs.id, title: schema.programs.title })
    .from(schema.programs)
    .orderBy(asc(schema.programs.sortOrder));
  return rows.map((p) => ({ value: p.id, label: p.title }));
}
