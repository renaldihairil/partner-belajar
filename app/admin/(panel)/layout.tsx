import { Toaster } from "@/components/admin/Toaster";
import { AdminChrome } from "@/components/admin/shell/AdminChrome";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdmin();
  return (
    <>
      <AdminChrome admin={{ name: admin.name, email: admin.email, role: admin.role, permissions: admin.permissions }}>{children}</AdminChrome>
      <Toaster />
    </>
  );
}
