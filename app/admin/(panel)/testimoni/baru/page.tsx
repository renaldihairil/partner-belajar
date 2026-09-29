import type { Metadata } from "next";
import { TestimonialForm } from "@/components/admin/forms/TestimonialForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { programOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Tambah testimoni" };

export default async function NewTestimonialPage() {
  return (
    <>
      <AdminPageHeader title="Tambah testimoni" back={{ href: "/admin/testimoni", label: "Semua testimoni" }} />
      <TestimonialForm programs={await programOptions()} />
    </>
  );
}
