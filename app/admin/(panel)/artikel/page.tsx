import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { CircleCheckBig, ExternalLink, FilePenLine, Newspaper, Star } from "lucide-react";
import { deleteArticleAction, toggleArticleAction } from "@/app/admin/actions/articles";
import { RowActions } from "@/components/admin/RowActions";
import {
  AddLink,
  AdminPageHeader,
  Badge,
  EmptyState,
  ListCard,
  ListRow,
  Notice,
  noticeMessages,
  RowNumber,
  StatCards,
  StatusBadge,
  type BadgeTone,
} from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { formatDateLongId } from "@/lib/format";

export const metadata: Metadata = { title: "Artikel" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

const GRID = "@3xl:grid-cols-[2.5rem_minmax(0,1fr)_8rem_9rem_9rem_11rem]";

const categoryTone: Record<string, BadgeTone> = { "Tips Belajar": "teal", Parenting: "orange", Bahasa: "info", Islami: "purple" };

export default async function AdminArticlesPage({ searchParams }: PageProps) {
  const { pesan } = await searchParams;
  const db = await requireDb();
  const items = await db
    .select({
      id: schema.articles.id,
      slug: schema.articles.slug,
      title: schema.articles.title,
      excerpt: schema.articles.excerpt,
      image: schema.articles.image,
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
        description="Kelola artikel edukatif yang ditampilkan di website. Diurutkan dari tanggal terbit terbaru."
        searchPlaceholder="Cari artikel..."
        action={<AddLink href="/admin/artikel/baru">Tambah Artikel</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      <StatCards
        items={[
          { label: "Total artikel", value: items.length, icon: Newspaper, tone: "teal" },
          { label: "Dipublikasikan", value: live, icon: CircleCheckBig, tone: "green" },
          { label: "Draf", value: items.length - live, icon: FilePenLine, tone: "yellow" },
          { label: "Artikel pilihan", value: items.filter((a) => a.featured).length, icon: Star, tone: "purple" },
        ]}
      />
      {items.length === 0 ? (
        <EmptyState action={<AddLink href="/admin/artikel/baru">Tambah Artikel</AddLink>}>Belum ada artikel.</EmptyState>
      ) : (
        <ListCard count={items.length} head={["No", "Judul artikel", "Kategori", "Tanggal", "Status", "Aksi"]} cols={GRID}>
          {items.map((item, index) => (
            <ListRow key={item.id} muted={!item.published} cols={GRID} search={`${item.title} ${item.excerpt} ${item.category} ${item.authorName}`}>
              <RowNumber n={index + 1} />
              <Link href={`/admin/artikel/${item.id}`} className="row-main group flex min-w-0 items-center gap-3.5">
                <span className="relative block h-12 w-[4.5rem] shrink-0 overflow-clip rounded-xl bg-[var(--adm-hover)] ring-1 ring-line">
                  {/* eslint-disable-next-line @next/next/no-img-element -- sampul dari lokal / Blob */}
                  <img src={item.image} alt="" className="size-full object-cover" loading="lazy" />
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-brand-teal-dark">{item.title}</span>
                  <span className="block truncate text-xs text-ink-soft">{item.authorName}</span>
                </span>
              </Link>
              <div>
                <Badge tone={categoryTone[item.category] ?? "info"}>{item.category}</Badge>
              </div>
              <div className="text-[13px] text-ink-soft">{formatDateLongId(item.date)}</div>
              <div className="flex flex-wrap items-center gap-1.5">
                <StatusBadge published={item.published} labels={["Dipublikasikan", "Draf"]} />
                {item.featured && <Badge tone="teal">Pilihan</Badge>}
              </div>
              <div className="flex items-center gap-1">
                {item.published && (
                  <Link
                    href={`/artikel/${item.slug}`}
                    target="_blank"
                    aria-label={`Lihat artikel ${item.title} di situs`}
                    title="Lihat di situs"
                    className="grid size-9 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink"
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
              </div>
            </ListRow>
          ))}
        </ListCard>
      )}
    </div>
  );
}
