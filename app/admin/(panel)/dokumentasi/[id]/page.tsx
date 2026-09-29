import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { DocumentationForm } from "@/components/admin/forms/DocumentationForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { programOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Edit video" };

export default async function EditDocumentationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await requireDb();
  const [item] = await db.select().from(schema.documentation).where(eq(schema.documentation.id, id)).limit(1);
  if (!item) notFound();
  return (
    <>
      <AdminPageHeader title="Edit video" description={item.title} back={{ href: "/admin/dokumentasi", label: "Semua video" }} />
      <DocumentationForm item={item} programs={await programOptions()} today={item.date} />
    </>
  );
}
