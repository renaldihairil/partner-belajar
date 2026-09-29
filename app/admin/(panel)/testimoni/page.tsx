import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { Star } from "lucide-react";
import { deleteTestimonialAction, moveTestimonialAction, toggleTestimonialAction } from "@/app/admin/actions/testimonials";
import { RowActions } from "@/components/admin/RowActions";
import { AddLink, AdminPageHeader, Badge, EmptyState, Notice, noticeMessages } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { programOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Testimoni" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

export default async function AdminTestimonialsPage({ searchParams }: PageProps) {
  const { pesan } = await searchParams;
  const db = await requireDb();
  const [items, programs] = await Promise.all([
    db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.sortOrder)),
    programOptions(),
  ]);
  const programName = new Map(programs.map((p) => [p.value, p.label]));

  return (
    <>
      <AdminPageHeader
        title="Testimoni"
        description="Urutan di sini = urutan tampil di Home dan halaman Testimoni."
        action={<AddLink href="/admin/testimoni/baru">Tambah testimoni</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      {items.length === 0 ? (
        <EmptyState>Belum ada testimoni.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {items.map((item, index) => (
            <li key={item.id} className={`rounded-[20px] border border-line bg-surface p-4 shadow-soft ${item.published ? "" : "opacity-70"}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink">{item.name}</p>
                    <span className="flex items-center gap-0.5 text-brand-yellow" role="img" aria-label={`${item.rating} bintang`}>
                      {Array.from({ length: item.rating }, (_, i) => (
                        <Star key={i} aria-hidden className="size-3.5" fill="currentColor" strokeWidth={0} />
                      ))}
                    </span>
                    {!item.published && <Badge tone="warning">Disembunyikan</Badge>}
                  </div>
                  <p className="text-xs text-ink-soft">
                    {[item.role, item.city, item.programId && programName.get(item.programId)].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{item.quote}</p>
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
