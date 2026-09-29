import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { deleteArticleAction, toggleArticleAction } from "@/app/admin/actions/articles";
import { RowActions } from "@/components/admin/RowActions";
import { AddLink, AdminPageHeader, Badge, EmptyState, ListCard, ListRow, Notice, noticeMessages, StatusBadge } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { formatDateLongId } from "@/lib/format";

export const metadata: Metadata = { title: "Artikel" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

export default async function AdminArticlesPage({ searchParams }: PageProps) {
  const { pesan } = await searchParams;
  const db = await requireDb();
  const items = await db
    .select({
      id: schema.articles.id,
      slug: schema.articles.slug,
      title: schema.articles.title,
      excerpt: schema.articles.excerpt,
      category: schema.articles.category,
      date: schema.articles.date,
      featured: schema.articles.featured,
      published: schema.articles.published,
      authorName: schema.articles.authorName,
    })
    .from(schema.articles)
    .orderBy(desc(schema.articles.date), desc(schema.articles.createdAt));
  const live = items.filter((a) => a.published).length;

  return (
    <div className="adm-fade-in">
      <AdminPageHeader
        title="Artikel"
        description={items.length ? `${live} terbit, ${items.length - live} draf. Artikel diurutkan dari tanggal terbit terbaru.` : "Tulis artikel untuk halaman Artikel di situs."}
        action={<AddLink href="/admin/artikel/baru">Tulis artikel</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      {items.length === 0 ? (
        <EmptyState action={<AddLink href="/admin/artikel/baru">Tulis artikel</AddLink>}>Belum ada artikel.</EmptyState>
      ) : (
        <ListCard title="Semua artikel" count={items.length}>
          {items.map((item) => (
            <ListRow key={item.id} muted={!item.published}>
              <Link href={`/admin/artikel/${item.id}`} className="row-main group flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold text-ink group-hover:text-brand-teal-dark">{item.title}</span>
                <span className="mt-0.5 line-clamp-1 text-[13px] text-ink-soft">{item.excerpt}</span>
                <span className="mt-1 text-xs text-ink-soft">
                  {formatDateLongId(item.date)} · {item.authorName}
                </span>
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 md:w-56 md:justify-end">
                <Badge tone="info">{item.category}</Badge>
                {item.featured && <Badge tone="success">Pilihan</Badge>}
                <StatusBadge published={item.published} />
              </div>
              {item.published && (
                <Link
                  href={`/artikel/${item.slug}`}
                  target="_blank"
                  aria-label={`Lihat artikel ${item.title} di situs`}
                  title="Lihat di situs"
                  className="grid size-8 place-items-center rounded-md text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink"
                >
                  <ExternalLink aria-hidden className="size-4" />
                </Link>
              )}
              <RowActions
                id={item.id}
                label={`artikel ${item.title}`}
                editHref={`/admin/artikel/${item.id}`}
                published={item.published}
                toggleAction={toggleArticleAction}
                deleteAction={deleteArticleAction}
              />
            </ListRow>
          ))}
        </ListCard>
      )}
    </div>
  );
}
