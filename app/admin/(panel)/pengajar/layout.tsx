import { requirePermission } from "@/lib/auth/session";

/** Pintu hak akses menu ini — pengguna tanpa izin dialihkan ke dashboard. */
export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePermission("pengajar");
  return children;
}
