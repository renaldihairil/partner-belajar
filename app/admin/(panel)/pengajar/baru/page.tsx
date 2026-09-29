import type { Metadata } from "next";
import { TeacherForm } from "@/components/admin/forms/TeacherForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { programOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Tambah pengajar" };

export default async function NewTeacherPage() {
  return (
    <>
      <AdminPageHeader title="Tambah pengajar" back={{ href: "/admin/pengajar", label: "Semua pengajar" }} />
      <TeacherForm programs={await programOptions()} />
    </>
  );
}
