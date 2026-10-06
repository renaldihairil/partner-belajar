"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireDb, schema } from "@/db";
import { newId } from "@/lib/admin/form";
import { hashPassword } from "@/lib/auth/password";
import { requirePermission } from "@/lib/auth/session";

const BACK = "/admin/link-guru";
const PIN_PATTERN = /^\d{4,8}$/;

/** Kode acak 12 karakter (huruf besar-kecil, angka, - dan _): tidak bisa ditebak. */
function newToken() {
  return randomBytes(9).toString("base64url");
}

/** PIN opsional: kosong = link terbuka (null); terisi = harus 4–8 angka. */
function readPin(formData: FormData): string | null {
  const pin = String(formData.get("pin") ?? "").trim();
  if (!pin) return null;
  if (!PIN_PATTERN.test(pin)) redirect(`${BACK}?pesan=pin-tidak-valid`);
  return pin;
}

export async function createTeacherLinkAction(formData: FormData) {
  await requirePermission("pengajar");
  const pin = readPin(formData);
  const label = String(formData.get("label") ?? "").trim().slice(0, 80) || "Form data pengajar";

  const db = await requireDb();
  await db.insert(schema.teacherLinks).values({
    id: newId("linkguru"),
    token: newToken(),
    label,
    pinHash: pin ? await hashPassword(pin) : null,
  });
  revalidatePath(BACK);
  redirect(`${BACK}?pesan=${pin ? "link-guru-dibuat-pin" : "link-guru-dibuat"}`);
}

/** Mengatur PIN (kosong = hapus PIN). Akses yang sudah terbuka dengan PIN lama otomatis tidak berlaku lagi. */
export async function changeTeacherLinkPinAction(formData: FormData) {
  await requirePermission("pengajar");
  const pin = readPin(formData);

  const db = await requireDb();
  await db
    .update(schema.teacherLinks)
    .set({ pinHash: pin ? await hashPassword(pin) : null, updatedAt: new Date() })
    .where(eq(schema.teacherLinks.id, String(formData.get("id"))));
  revalidatePath(BACK);
  redirect(`${BACK}?pesan=${pin ? "pin-diganti" : "pin-dihapus"}`);
}

export async function toggleTeacherLinkAction(formData: FormData) {
  await requirePermission("pengajar");
  const db = await requireDb();
  await db
    .update(schema.teacherLinks)
    .set({ active: formData.get("active") === "on", updatedAt: new Date() })
    .where(eq(schema.teacherLinks.id, String(formData.get("id"))));
  revalidatePath(BACK);
}

export async function deleteTeacherLinkAction(formData: FormData) {
  await requirePermission("pengajar");
  const db = await requireDb();
  // Data guru yang sudah masuk tetap ada (link_id otomatis dikosongkan).
  await db.delete(schema.teacherLinks).where(eq(schema.teacherLinks.id, String(formData.get("id"))));
  revalidatePath(BACK);
  redirect(`${BACK}?pesan=link-guru-dihapus`);
}
