import "server-only";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { getDb, schema } from "@/db";
import type { TeacherLinkRow } from "@/db/schema";
import { sessionSecret } from "@/lib/auth/token";

/**
 * Akses ke form guru.
 * - Link tanpa PIN: terbuka, cukup punya link (seperti link testimoni).
 * - Link dengan PIN: setelah PIN benar, pengunjung mendapat cookie bertanda tangan yang berlaku beberapa jam.
 */

export const FORM_COOKIE = "pb_guru_form";
const ACCESS_SECONDS = 60 * 60 * 3; // 3 jam
const AUDIENCE = "form-guru";

export const teacherFormPath = (token: string) => `/form-guru/${token}`;

/** Sidik jari singkat dari hash PIN: bila PIN diganti, semua akses lama otomatis tidak berlaku. */
function pinStamp(pinHash: string): string {
  return createHash("sha256").update(pinHash).digest("hex").slice(0, 16);
}

export async function loadTeacherLink(token: string): Promise<TeacherLinkRow | null> {
  const db = await getDb().catch(() => null);
  if (!db || !token) return null;
  const [link] = await db.select().from(schema.teacherLinks).where(eq(schema.teacherLinks.token, token)).limit(1);
  return link ?? null;
}

export async function grantTeacherFormAccess(link: Pick<TeacherLinkRow, "id" | "token" | "pinHash">): Promise<void> {
  if (!link.pinHash) return; // link terbuka: tidak perlu akses khusus
  const secret = sessionSecret();
  if (!secret) throw new Error("AUTH_SECRET belum diatur (minimal 32 karakter).");
  const jwt = await new SignJWT({ pv: pinStamp(link.pinHash) })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(link.id)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_SECONDS}s`)
    .sign(secret);
  (await cookies()).set(FORM_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Hanya terkirim untuk halaman form ini (termasuk server action-nya).
    path: teacherFormPath(link.token),
    maxAge: ACCESS_SECONDS,
  });
}

/** Link-nya (bila ada) dan apakah pengunjung ini sudah membuka form dengan PIN yang benar. */
export async function getTeacherFormAccess(token: string): Promise<{ link: TeacherLinkRow | null; unlocked: boolean }> {
  const link = await loadTeacherLink(token);
  if (!link || !link.active) return { link, unlocked: false };
  if (!link.pinHash) return { link, unlocked: true };
  const secret = sessionSecret();
  const raw = (await cookies()).get(FORM_COOKIE)?.value;
  if (!secret || !raw) return { link, unlocked: false };
  try {
    const { payload } = await jwtVerify(raw, secret, { algorithms: ["HS256"], audience: AUDIENCE });
    return { link, unlocked: payload.sub === link.id && payload.pv === pinStamp(link.pinHash) };
  } catch {
    return { link, unlocked: false };
  }
}
