"use server";

import { count, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDb, schema } from "@/db";
import { formToObject, requiredText, zodErrors, type ActionState } from "@/lib/admin/form";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { PERMISSION_KEYS, type PermissionKey } from "@/lib/auth/permissions";
import { ADMIN_USERS_TAG, requireAdmin, requireOwner } from "@/lib/auth/session";

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

const roleFields = {
  role: z.enum(["owner", "editor"], { error: "Pilih peran." }),
  permissions: z.array(z.enum(PERMISSION_KEYS as [string, ...string[]])).default([]),
};

const newAdminSchema = z.object({
  name: requiredText("Nama", 80),
  email: z.string().trim().toLowerCase().email("Email tidak valid."),
  password,
  ...roleFields,
});

/** Editor tanpa satu pun hak akses tidak berguna — minta minimal satu. */
function permissionsError(role: string, permissions: string[]): ActionState | null {
  if (role === "editor" && permissions.length === 0) {
    return { message: "Pilih minimal satu menu untuk Editor.", errors: { permissions: "Pilih minimal satu menu." } };
  }
  return null;
}

async function ownerCount(db: Awaited<ReturnType<typeof requireDb>>) {
  const [{ value }] = await db.select({ value: count() }).from(schema.adminUsers).where(eq(schema.adminUsers.role, "owner"));
  return value;
}

export async function createAdminAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireOwner();
  const parsed = newAdminSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const invalid = permissionsError(parsed.data.role, parsed.data.permissions);
  if (invalid) return invalid;
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
    role: parsed.data.role,
    permissions: parsed.data.role === "owner" ? [] : (parsed.data.permissions as PermissionKey[]),
  });
  revalidateTag(ADMIN_USERS_TAG);
  redirect("/admin/pengguna?pesan=dibuat");
}

const editAdminSchema = z.object({
  id: z.string().min(1),
  name: requiredText("Nama", 80),
  newPassword: z.string().max(200).optional(),
  ...roleFields,
});

export async function updateAdminAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireOwner();
  const parsed = editAdminSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { message: "Periksa kembali isian yang ditandai.", errors: zodErrors(parsed.error) };
  const { id, name, newPassword, role, permissions } = parsed.data;
  const invalid = permissionsError(role, permissions);
  if (invalid) return invalid;
  if (newPassword && newPassword.length < 10) {
    return { message: "Password baru minimal 10 karakter.", errors: { newPassword: "Minimal 10 karakter." } };
  }

  const db = await requireDb();
  const [target] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, id)).limit(1);
  if (!target) return { message: "Akun tidak ditemukan." };
  if (target.id === me.id && role !== target.role) {
    return { message: "Anda tidak bisa mengubah peran akun sendiri.", errors: { role: "Tidak bisa mengubah peran sendiri." } };
  }
  if (target.role === "owner" && role !== "owner" && (await ownerCount(db)) <= 1) {
    return { message: "Harus ada minimal satu Pemilik.", errors: { role: "Harus ada minimal satu Pemilik." } };
  }

  await db
    .update(schema.adminUsers)
    .set({
      name,
      role,
      permissions: role === "owner" ? [] : (permissions as PermissionKey[]),
      ...(newPassword ? { passwordHash: await hashPassword(newPassword) } : {}),
      updatedAt: new Date(),
    })
    .where(eq(schema.adminUsers.id, id));
  revalidateTag(ADMIN_USERS_TAG);
  redirect("/admin/pengguna?pesan=tersimpan");
}

export async function deleteAdminAction(formData: FormData) {
  const admin = await requireOwner();
  const id = String(formData.get("id"));
  if (id === admin.id) redirect("/admin/pengguna?pesan=diri-sendiri");
  const db = await requireDb();
  const [target] = await db
    .select({ role: schema.adminUsers.role })
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.id, id))
    .limit(1);
  if (!target) redirect("/admin/pengguna");
  if (target.role === "owner" && (await ownerCount(db)) <= 1) redirect("/admin/pengguna?pesan=pemilik-terakhir");
  await db.delete(schema.adminUsers).where(eq(schema.adminUsers.id, id));
  revalidateTag(ADMIN_USERS_TAG);
  redirect("/admin/pengguna?pesan=dihapus");
}
