import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ModuleForm } from "@/components/admin/forms/ModuleForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { programOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Edit modul" };

export default async function EditModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await requireDb();
  const [item] = await db.select().from(schema.learningModules).where(eq(schema.learningModules.id, id)).limit(1);
  if (!item) notFound();
  return (
    <>
      <AdminPageHeader title="Edit modul" description={item.title} back={{ href: "/admin/modul", label: "Semua modul" }} />
      <ModuleForm item={item} programs={await programOptions()} />
    </>
  );
}
