import "server-only";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

/** URL database dari integrasi Neon di Vercel (nama variabel bisa salah satu dari ini). */
export function databaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

/**
 * Tanpa DATABASE_URL:
 * - development → database lokal PGlite di folder .data/ (dibuat & diisi otomatis),
 * - production  → tidak ada database; situs publik memakai data bawaan di folder data/.
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(databaseUrl()) || process.env.NODE_ENV !== "production";
}

const globalForDb = globalThis as unknown as { __pbDb?: Promise<Db | null> };

async function connect(): Promise<Db | null> {
  const url = databaseUrl();
  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    return drizzle(neon(url), { schema }) as unknown as Db;
  }
  if (process.env.NODE_ENV === "production") return null;

  // Database lokal untuk development — otomatis dimigrasi & diisi data awal.
  const { createLocalDb } = await import("./local");
  return createLocalDb();
}

/** Koneksi database (satu instance per proses), atau null bila belum dikonfigurasi. */
export function getDb(): Promise<Db | null> {
  globalForDb.__pbDb ??= connect().catch((error) => {
    globalForDb.__pbDb = undefined;
    throw error;
  });
  return globalForDb.__pbDb;
}

/** Seperti getDb(), tetapi melempar error yang jelas bila database belum terhubung (untuk admin). */
export async function requireDb(): Promise<Db> {
  const db = await getDb();
  if (!db) throw new Error("Database belum terhubung. Hubungkan Neon di Vercel (Storage) lalu deploy ulang.");
  return db;
}

export { schema };
