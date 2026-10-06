import "server-only";
import { and, count, eq, gte } from "drizzle-orm";
import { schema, type Db } from "@/db";

/** Pembatas sederhana berbasis tabel login_attempts: satu baris = satu kejadian untuk sebuah kunci. */

export async function recentAttempts(db: Db, key: string, windowMs: number): Promise<number> {
  const since = new Date(Date.now() - windowMs);
  const [{ value }] = await db
    .select({ value: count() })
    .from(schema.loginAttempts)
    .where(and(eq(schema.loginAttempts.key, key), gte(schema.loginAttempts.createdAt, since)));
  return value;
}

export async function recordAttempt(db: Db, ...keys: string[]): Promise<void> {
  if (keys.length) await db.insert(schema.loginAttempts).values(keys.map((key) => ({ key })));
}

export async function clearAttempts(db: Db, key: string): Promise<void> {
  await db.delete(schema.loginAttempts).where(eq(schema.loginAttempts.key, key));
}
