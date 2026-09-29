import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProgramForm } from "@/components/admin/forms/ProgramForm";
import { Notice } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";

export const metadata: Metadata = { title: "Edit program" };

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ pesan?: string }> };

export default async function EditProgramPage({ params, searchParams }: PageProps) {
  const [{ id }, { pesan }] = await Promise.all([params, searchParams]);
  const db = await requireDb();
  const [item] = await db.select().from(schema.programs).where(eq(schema.programs.id, id)).limit(1);
  if (!item) notFound();
  return (
    <>
      <Notice message={pesan === "dibuat" ? "Program berhasil dibuat. Lanjutkan dengan menambahkan jadwal kelas di tab Jadwal kelas." : undefined} />
      <ProgramForm item={item} />
    </>
  );
}
