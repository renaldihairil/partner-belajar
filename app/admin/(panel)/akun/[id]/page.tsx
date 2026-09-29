import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditAdminForm } from "@/components/admin/forms/AccountForms";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { cleanPermissions } from "@/lib/auth/permissions";
import { requireOwner } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Ubah admin" };

export default async function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireOwner();
  const { id } = await params;
  const db = await requireDb();
  const [admin] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, id)).limit(1);
  if (!admin) notFound();
  return (
    <>
      <AdminPageHeader title={`Ubah admin ${admin.name}`} back={{ href: "/admin/akun", label: "Akun admin" }} />
      <EditAdminForm
        isSelf={admin.id === me.id}
        admin={{ id: admin.id, name: admin.name, email: admin.email, role: admin.role === "editor" ? "editor" : "owner", permissions: cleanPermissions(admin.permissions) }}
      />
    </>
  );
}
