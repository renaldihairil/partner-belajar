import "server-only";
import { asc, eq } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import type { Db } from "@/db";

type SortableTable = PgTable & { id: PgColumn; sortOrder: PgColumn };

/** Menukar posisi satu baris dengan tetangganya, lalu menomori ulang urutan 0..n. */
export async function moveRow(db: Db, table: SortableTable, id: string, direction: "up" | "down") {
  const rows = (await db.select({ id: table.id }).from(table as PgTable).orderBy(asc(table.sortOrder))) as { id: string }[];
  const index = rows.findIndex((r) => r.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= rows.length) return;
  [rows[index], rows[target]] = [rows[target], rows[index]];
  await Promise.all(
    rows.map((row, order) => db.update(table as PgTable).set({ sortOrder: order } as never).where(eq(table.id, row.id))),
  );
}

/** Nomor urut untuk data baru (paling akhir). */
export async function nextSortOrder(db: Db, table: SortableTable): Promise<number> {
  const rows = (await db.select({ sortOrder: table.sortOrder }).from(table as PgTable)) as { sortOrder: number }[];
  return rows.reduce((max, r) => Math.max(max, r.sortOrder + 1), 0);
}
