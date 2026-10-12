import "server-only";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { TeacherRow } from "@/db/schema";

/** Alamat form pembaruan pribadi seorang guru. */
export function teacherEditPath(token: string): string {
  return `/profil-guru/${token}`;
}

/** Kode rahasia 12 karakter (sama seperti link testimoni & form guru): tidak bisa ditebak. */
export function newEditToken(): string {
  return randomBytes(9).toString("base64url");
}

/** Guru pemilik link pribadi ini, atau null bila kode tidak dikenal / sudah diganti admin. */
export async function loadTeacherByEditToken(token: string): Promise<TeacherRow | null> {
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(token)) return null;
  const db = await getDb().catch(() => null);
  if (!db) return null;
  const [row] = await db.select().from(schema.teachers).where(eq(schema.teachers.editToken, token)).limit(1);
  return row ?? null;
}
