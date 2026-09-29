"use server";

import { count, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDb, schema } from "@/db";
import { formToObject, requiredText, zodErrors, type ActionState } from "@/lib/admin/form";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { ADMIN_USERS_TAG, requireAdmin } from "@/lib/auth/session";

const password = z.string().min(10, "Password minimal 10 karakter.").max(200);

const changeSchema = z
  .object({ current: z.string().min(1, "Isi password saat ini."), next: password, confirm: z.string() })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], message: "Konfirmasi password tidak sama." });

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = changeSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const db = await requireDb();
  const [user] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, admin.id)).limit(1);
  if (!user || !(await verifyPassword(parsed.data.current, user.passwordHash))) {
    return { message: "Password saat ini salah.", errors: { current: "Password saat ini salah." } };
  }
  await db
    .update(schema.adminUsers)
    .set({ passwordHash: await hashPassword(parsed.data.next), updatedAt: new Date() })
    .where(eq(schema.adminUsers.id, admin.id));
  return { ok: true, message: "Password berhasil diganti." };
}

const newAdminSchema = z.object({
  name: requiredText("Nama", 80),
  email: z.string().trim().toLowerCase().email("Email tidak valid."),
  password,
});

export async function createAdminAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = newAdminSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const db = await requireDb();
  const [exists] = await db
    .select({ id: schema.adminUsers.id })
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, parsed.data.email))
    .limit(1);
  if (exists) return { message: "Email sudah terdaftar sebagai admin.", errors: { email: "Sudah terdaftar." } };
  await db.insert(schema.adminUsers).values({
    id: crypto.randomUUID(),
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash: await hashPassword(parsed.data.password),
  });
  revalidateTag(ADMIN_USERS_TAG);
  redirect("/admin/akun?pesan=dibuat");
}

export async function deleteAdminAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id"));
  if (id === admin.id) redirect("/admin/akun?pesan=diri-sendiri");
  const db = await requireDb();
  const [{ value }] = await db.select({ value: count() }).from(schema.adminUsers);
  if (value <= 1) redirect("/admin/akun");
  await db.delete(schema.adminUsers).where(eq(schema.adminUsers.id, id));
  revalidateTag(ADMIN_USERS_TAG);
  redirect("/admin/akun?pesan=dihapus");
}
