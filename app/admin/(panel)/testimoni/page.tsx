import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { EyeOff, Eye, MessageSquareQuote, Star } from "lucide-react";
import { deleteTestimonialAction, moveTestimonialAction, toggleTestimonialAction } from "@/app/admin/actions/testimonials";
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
} from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { programOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Testimoni" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

const GRID = "@3xl:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,11rem)_7rem_8rem_13rem]";

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
        description="Cerita orang tua yang tampil di Home dan halaman Testimoni. Urutan di sini sama dengan urutan tampil."
        searchPlaceholder="Cari testimoni..."
        action={<AddLink href="/admin/testimoni/baru">Tambah Testimoni</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      <StatCards
        items={[
          { label: "Total testimoni", value: items.length, icon: MessageSquareQuote, tone: "teal" },
          { label: "Tampil di situs", value: items.filter((t) => t.published).length, icon: Eye, tone: "green" },
          { label: "Rating rata-rata", value: average.toLocaleString("id-ID", { maximumFractionDigits: 1 }), icon: Star, tone: "yellow" },
          { label: "Disembunyikan", value: items.filter((t) => !t.published).length, icon: EyeOff, tone: "purple" },
        ]}
      />
      {items.length === 0 ? (
        <EmptyState action={<AddLink href="/admin/testimoni/baru">Tambah Testimoni</AddLink>}>Belum ada testimoni.</EmptyState>
      ) : (
        <ListCard count={items.length} head={["No", "Nama & pesan", "Program", "Kota", "Status", "Aksi"]} cols={GRID}>
          {items.map((item, index) => (
            <ListRow
              key={item.id}
              muted={!item.published}
              cols={GRID}
              search={`${item.name} ${item.quote} ${item.city ?? ""} ${programName.get(item.programId ?? "") ?? ""}`}
            >
              <RowNumber n={index + 1} />
              <Link href={`/admin/testimoni/${item.id}`} className="row-main group flex min-w-0 items-start gap-3.5">
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-teal-soft text-xs font-bold text-brand-teal-dark shadow-soft ring-2 ring-white dark:ring-line"
                >
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
              <div>
                {item.programId ? <Badge tone="info">{programName.get(item.programId) ?? item.programId}</Badge> : <span className="text-xs text-ink-soft">—</span>}
              </div>
              <div className="text-[13px] text-ink-soft">{item.city ?? "—"}</div>
              <div>
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
