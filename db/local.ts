import { existsSync, mkdirSync, renameSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import type { Db } from "./index";
import * as schema from "./schema";
import { seedIfEmpty } from "./seed";

/**
 * Database Postgres lokal (PGlite) untuk development.
 * Disimpan di folder pengguna (bukan di folder proyek) karena PGlite tidak bisa berjalan
 * di drive FAT32. Lokasi bisa diganti lewat PGLITE_DIR di .env.local.
 */
export async function createLocalDb(): Promise<Db> {
  const dir = process.env.PGLITE_DIR || path.join(os.homedir(), ".partner-belajar", "pglite");
  try {
    return await openLocalDb(dir);
  } catch (error) {
    // Data lokal bisa rusak bila server dev dimatikan paksa. Simpan folder lama sebagai cadangan,
    // lalu buat ulang dari data awal (hanya development; database online tidak tersentuh).
    if (!existsSync(dir)) throw error;
    const backup = `${dir}-rusak-${Date.now()}`;
    renameSync(dir, backup);
    console.warn(`[db] Database lokal gagal dibuka, dipindahkan ke ${backup} dan dibuat ulang.`, error);
    return openLocalDb(dir);
  }
}

async function openLocalDb(dir: string): Promise<Db> {
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  const db = drizzle(client, { schema }) as unknown as Db;
  await migrate(drizzle(client), { migrationsFolder: path.join(process.cwd(), "db", "migrations") });
  const seeded = await seedIfEmpty(db);
  if (seeded.length) console.log(`[db] Database lokal diisi data awal (${seeded.join(", ")}) di ${dir}`);
  return db;
}
