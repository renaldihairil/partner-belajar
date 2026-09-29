import "server-only";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb, schema } from "@/db";
import { cleanPermissions, hasPermission, type AccessInfo, type PermissionKey } from "./permissions";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession, type SessionPayload } from "./token";

export async function createSession(user: SessionPayload) {
  const token = await signSession(user);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Tag cache akun admin — panggil revalidateTag(ADMIN_USERS_TAG) setelah akun ditambah/dihapus/diubah. */
export const ADMIN_USERS_TAG = "admin-users";

/**
 * Data akun disimpan di cache server agar pindah halaman admin tidak selalu menunggu database.
 * Cache dibersihkan setiap kali akun admin berubah, jadi akun yang dihapus tetap langsung keluar.
 */
function loadAdmin(id: string) {
  return unstable_cache(
    async () => {
      const db = await getDb();
      if (!db) return null;
      const [user] = await db
        .select({
          id: schema.adminUsers.id,
          email: schema.adminUsers.email,
          name: schema.adminUsers.name,
          role: schema.adminUsers.role,
          permissions: schema.adminUsers.permissions,
        })
        .from(schema.adminUsers)
        .where(eq(schema.adminUsers.id, id))
        .limit(1);
      return user ? { ...user, role: user.role === "editor" ? ("editor" as const) : ("owner" as const), permissions: cleanPermissions(user.permissions) } : null;
    },
    ["admin-user", id],
    { tags: [ADMIN_USERS_TAG], revalidate: 3600 },
  )();
}

/** Admin yang sedang login: sesi ditandatangani (cookie) + akun masih ada di database. */
export const getCurrentAdmin = cache(async () => {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  return loadAdmin(session.sub);
});

/** Wajib dipanggil di setiap halaman & server action admin. */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** Wajib login DAN punya hak akses ke menu tersebut; jika tidak, dialihkan ke dashboard. */
export async function requirePermission(key: PermissionKey) {
  const admin = await requireAdmin();
  if (!hasPermission(admin, key)) redirect("/admin?pesan=tanpa-akses");
  return admin;
}

/** Hanya pemilik (mengelola akun admin lain). */
export async function requireOwner() {
  const admin = await requireAdmin();
  if (admin.role !== "owner") redirect("/admin?pesan=tanpa-akses");
  return admin;
}

export type { AccessInfo };
