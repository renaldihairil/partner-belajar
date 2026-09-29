import type { Metadata } from "next";
import { ArticleForm } from "@/components/admin/forms/ArticleForm";
import { AdminPageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Tulis artikel" };

export default function NewArticlePage() {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  return (
    <>
      <AdminPageHeader title="Tulis artikel" back={{ href: "/admin/artikel", label: "Semua artikel" }} />
      <ArticleForm today={today} />
    </>
  );
}
