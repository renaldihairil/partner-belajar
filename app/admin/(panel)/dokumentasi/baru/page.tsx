import type { Metadata } from "next";
import { DocumentationForm } from "@/components/admin/forms/DocumentationForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { programOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Tambah video" };

export default async function NewDocumentationPage() {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  return (
    <>
      <AdminPageHeader title="Tambah video" back={{ href: "/admin/dokumentasi", label: "Semua video" }} />
      <DocumentationForm programs={await programOptions()} today={today} />
    </>
  );
}
