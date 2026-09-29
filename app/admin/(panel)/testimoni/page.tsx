import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { Star } from "lucide-react";
import { deleteTestimonialAction, moveTestimonialAction, toggleTestimonialAction } from "@/app/admin/actions/testimonials";
import { RowActions } from "@/components/admin/RowActions";
import { AddLink, AdminPageHeader, Badge, EmptyState, ListCard, ListRow, Notice, noticeMessages, StatusBadge } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { programOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Testimoni" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

function initials(name: string) {
  return name
    .replace(/^(Ibu|Bapak|Bu|Pak)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function AdminTestimonialsPage({ searchParams }: PageProps) {
  const { pesan } = await searchParams;
  const db = await requireDb();
  const [items, programs] = await Promise.all([
    db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.sortOrder)),
    programOptions(),
  ]);
  const programName = new Map(programs.map((p) => [p.value, p.label]));
  const average = items.length ? items.reduce((sum, t) => sum + t.rating, 0) / items.length : 0;

  return (
    <div className="adm-fade-in">
      <AdminPageHeader
        title="Testimoni"
        description={
          items.length
            ? `Rata-rata rating ${average.toLocaleString("id-ID", { maximumFractionDigits: 1 })} dari ${items.length} testimoni. Urutan di sini sama dengan urutan tampil di situs.`
            : "Cerita orang tua yang tampil di Home dan halaman Testimoni."
        }
        action={<AddLink href="/admin/testimoni/baru">Tambah testimoni</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      {items.length === 0 ? (
        <EmptyState action={<AddLink href="/admin/testimoni/baru">Tambah testimoni</AddLink>}>Belum ada testimoni.</EmptyState>
      ) : (
        <ListCard title="Semua testimoni" count={items.length}>
          {items.map((item, index) => (
            <ListRow key={item.id} muted={!item.published}>
              <Link href={`/admin/testimoni/${item.id}`} className="row-main group flex min-w-0 flex-1 items-start gap-3.5">
                <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-teal-soft text-xs font-semibold text-brand-teal-dark">
                  {initials(item.name)}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-semibold text-ink group-hover:text-brand-teal-dark">{item.name}</span>
                    <span className="flex items-center gap-0.5 text-brand-yellow" role="img" aria-label={`${item.rating} bintang`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} aria-hidden className={`size-3 ${i < item.rating ? "" : "text-line"}`} fill="currentColor" strokeWidth={0} />
                      ))}
                    </span>
                  </span>
                  <span className="mt-0.5 line-clamp-1 text-[13px] text-ink-soft">{item.quote}</span>
                </span>
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 md:w-64 md:justify-end">
                {item.programId && <Badge tone="info">{programName.get(item.programId) ?? item.programId}</Badge>}
                {item.city && <Badge>{item.city}</Badge>}
                <StatusBadge published={item.published} />
              </div>
              <RowActions
                id={item.id}
                label={`testimoni ${item.name}`}
                editHref={`/admin/testimoni/${item.id}`}
                published={item.published}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                moveAction={moveTestimonialAction}
                toggleAction={toggleTestimonialAction}
                deleteAction={deleteTestimonialAction}
              />
            </ListRow>
          ))}
        </ListCard>
      )}
    </div>
  );
}
