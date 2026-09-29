import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ClassForm } from "@/components/admin/forms/ClassForm";
import { requireDb, schema } from "@/db";

export const metadata: Metadata = { title: "Edit kelas" };

export default async function EditClassPage({ params }: { params: Promise<{ id: string; classId: string }> }) {
  const { id, classId } = await params;
  const db = await requireDb();
  const [item] = await db
    .select()
    .from(schema.programClasses)
    .where(and(eq(schema.programClasses.id, classId), eq(schema.programClasses.programId, id)))
    .limit(1);
  if (!item) notFound();
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-ink">Edit {item.name}</h2>
      <ClassForm programId={id} item={item} />
    </>
  );
}
