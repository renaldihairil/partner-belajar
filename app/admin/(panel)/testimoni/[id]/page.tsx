import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/admin/forms/TestimonialForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { programOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Edit testimoni" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await requireDb();
  const [item] = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id)).limit(1);
  if (!item) notFound();
  return (
    <>
      <AdminPageHeader title={`Edit testimoni ${item.name}`} back={{ href: "/admin/testimoni", label: "Semua testimoni" }} />
      <TestimonialForm item={item} programs={await programOptions()} />
    </>
  );
}
