/**
 * Peran & hak akses admin (aman diimpor dari komponen client — tanpa modul server).
 *
 * - owner  : pemilik, akses ke semua menu + mengelola akun admin lain.
 * - editor : hanya menu yang dicentang di `permissions`.
 */
export const PERMISSIONS = [
  { key: "program", label: "Program & Jadwal", description: "Info program, harga, jadwal kelas." },
  { key: "pengajar", label: "Pengajar", description: "Profil dan foto pengajar." },
  { key: "testimoni", label: "Testimoni", description: "Cerita orang tua." },
  { key: "artikel", label: "Artikel", description: "Menulis dan menerbitkan artikel." },
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number]["key"];
export type AdminRole = "owner" | "editor";

export const PERMISSION_KEYS: PermissionKey[] = PERMISSIONS.map((p) => p.key);

export const ROLE_LABELS: Record<AdminRole, string> = { owner: "Pemilik", editor: "Editor" };

export type AccessInfo = { role: AdminRole; permissions: PermissionKey[] };

export function hasPermission(access: AccessInfo, key: PermissionKey): boolean {
  return access.role === "owner" || access.permissions.includes(key);
}

/** Buang nilai yang bukan kunci hak akses valid (data lama / input tidak dipercaya). */
export function cleanPermissions(value: unknown): PermissionKey[] {
  if (!Array.isArray(value)) return [];
  return PERMISSION_KEYS.filter((key) => value.includes(key));
}
