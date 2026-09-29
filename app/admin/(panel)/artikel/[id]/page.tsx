import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/forms/ArticleForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Edit artikel" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await requireDb();
  const [item] = await db.select().from(schema.articles).where(eq(schema.articles.id, id)).limit(1);
  if (!item) notFound();
  return (
    <>
      <AdminPageHeader title="Edit artikel" description={item.title} back={{ href: "/admin/artikel", label: "Semua artikel" }} />
      <ArticleForm item={item} today={item.date} siteUrl={siteConfig.url} siteName={siteConfig.name} />
    </>
  );
}
