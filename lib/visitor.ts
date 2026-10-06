import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

/**
 * Identitas pengunjung berupa hash dari alamat IP (alamat IP asli tidak disimpan).
 * Dipakai untuk membatasi percobaan/kiriman dari perangkat yang sama.
 */
export async function visitorHash(): Promise<string> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
  const salt = process.env.AUTH_SECRET || "partner-belajar";
  return createHash("sha256").update(`${salt}|${ip}`).digest("hex").slice(0, 24);
}
