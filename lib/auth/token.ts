import { jwtVerify, SignJWT } from "jose";

/** Dipakai juga oleh middleware (edge) — jangan impor modul khusus Node di sini. */

export const SESSION_COOKIE = "pb_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export type SessionPayload = { sub: string; email: string; name: string };

const DEV_SECRET = "dev-only-secret-partner-belajar-ganti-di-production";

/** Kunci penandatangan sesi. Production wajib AUTH_SECRET; development memakai kunci bawaan. */
export function sessionSecret(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET || (process.env.NODE_ENV !== "production" ? DEV_SECRET : "");
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const secret = sessionSecret();
  if (!secret) throw new Error("AUTH_SECRET belum diatur (minimal 32 karakter).");
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret);
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  const secret = sessionSecret();
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.name !== "string") return null;
    return { sub: payload.sub, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}
