import type { Metadata } from "next";
import { ProgramForm } from "@/components/admin/forms/ProgramForm";
import { AdminPageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Tambah program" };

export default function NewProgramPage() {
  return (
    <>
      <AdminPageHeader
        title="Tambah program"
        description="Setelah program dibuat, Anda bisa menambahkan jadwal kelasnya."
        back={{ href: "/admin/program", label: "Semua program" }}
      />
      <ProgramForm />
    </>
  );
}
