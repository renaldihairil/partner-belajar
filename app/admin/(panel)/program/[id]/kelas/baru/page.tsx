import type { Metadata } from "next";
import { ClassForm } from "@/components/admin/forms/ClassForm";

export const metadata: Metadata = { title: "Tambah kelas" };

export default async function NewClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-ink">Tambah jadwal kelas</h2>
      <ClassForm programId={id} />
    </>
  );
}
