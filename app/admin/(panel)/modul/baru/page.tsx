import type { Metadata } from "next";
import { ModuleForm } from "@/components/admin/forms/ModuleForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { programOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Tambah modul" };

export default async function NewModulePage() {
  return (
    <>
      <AdminPageHeader title="Tambah modul" back={{ href: "/admin/modul", label: "Semua modul" }} />
      <ModuleForm programs={await programOptions()} />
    </>
  );
}
