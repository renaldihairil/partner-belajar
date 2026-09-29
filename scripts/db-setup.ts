/**
 * Dijalankan otomatis sebelum `next build` (lihat package.json):
 * membuat/memperbarui tabel (migrasi) lalu mengisi data awal bila database masih kosong.
 * Tanpa DATABASE_URL (mis. belum menghubungkan Neon) langkah ini dilewati.
 */
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import type { Db } from "../db";
import * as schema from "../db/schema";
import { seedIfEmpty } from "../db/seed";

async function main() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    console.log("[db-setup] DATABASE_URL tidak ada — dilewati (situs memakai data bawaan).");
    return;
  }
  const db = drizzle(neon(url), { schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "db", "migrations") });
  console.log("[db-setup] Migrasi selesai.");
  const seeded = await seedIfEmpty(db as unknown as Db);
  console.log(seeded.length ? `[db-setup] Data awal diisi: ${seeded.join(", ")}` : "[db-setup] Data sudah ada.");
}

main().catch((error) => {
  console.error("[db-setup] Gagal:", error);
  process.exit(1);
});
