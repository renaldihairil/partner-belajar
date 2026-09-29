import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { TeacherForm } from "@/components/admin/forms/TeacherForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { programOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Edit pengajar" };

export default async function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await requireDb();
  const [item] = await db.select().from(schema.teachers).where(eq(schema.teachers.id, id)).limit(1);
  if (!item) notFound();
  return (
    <>
      <AdminPageHeader title={`Edit ${item.name}`} back={{ href: "/admin/pengajar", label: "Semua pengajar" }} />
      <TeacherForm item={item} programs={await programOptions()} />
    </>
  );
}
