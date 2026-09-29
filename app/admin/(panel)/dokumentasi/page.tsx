import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { CircleCheckBig, EyeOff, ExternalLink, Play, Video } from "lucide-react";
import { deleteDocumentationAction, toggleDocumentationAction } from "@/app/admin/actions/documentation";
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
import { programOptions } from "@/lib/admin/queries";
import { formatDateLongId } from "@/lib/format";
import { youtubeThumbnail, youtubeWatchUrl } from "@/lib/youtube";

export const metadata: Metadata = { title: "Dokumentasi" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

const GRID = "@3xl:grid-cols-[2.5rem_minmax(0,1fr)_9rem_9rem_9rem_11rem]";

const categoryTone: Record<string, BadgeTone> = { "Kelas Online": "info", "Tatap Muka": "teal", "Kegiatan Spesial": "purple" };

export default async function AdminDocumentationPage({ searchParams }: PageProps) {
  const { pesan } = await searchParams;
  const db = await requireDb();
  const [items, programs] = await Promise.all([
    db.select().from(schema.documentation).orderBy(desc(schema.documentation.date), desc(schema.documentation.createdAt)),
    programOptions(),
  ]);
  const programName = new Map(programs.map((p) => [p.value, p.label]));
  const live = items.filter((d) => d.published).length;

  return (
    <div className="adm-fade-in">
      <AdminPageHeader
        title="Dokumentasi"
        description="Kelola video dokumentasi belajar dari YouTube yang tampil di halaman Dokumentasi. Diurutkan dari tanggal kegiatan terbaru."
        searchPlaceholder="Cari video..."
        action={<AddLink href="/admin/dokumentasi/baru">Tambah Video</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      <StatCards
        items={[
          { label: "Total video", value: items.length, icon: Video, tone: "teal" },
          { label: "Tampil di situs", value: live, icon: CircleCheckBig, tone: "green" },
          { label: "Disembunyikan", value: items.length - live, icon: EyeOff, tone: "yellow" },
          { label: "Kegiatan spesial", value: items.filter((d) => d.category === "Kegiatan Spesial").length, icon: Play, tone: "purple" },
        ]}
      />
      {items.length === 0 ? (
        <EmptyState action={<AddLink href="/admin/dokumentasi/baru">Tambah Video</AddLink>}>Belum ada video dokumentasi.</EmptyState>
      ) : (
        <ListCard count={items.length} head={["No", "Video", "Kategori", "Tanggal", "Status", "Aksi"]} cols={GRID}>
          {items.map((item, index) => (
            <ListRow
              key={item.id}
              muted={!item.published}
              cols={GRID}
              search={`${item.title} ${item.caption} ${item.category} ${programName.get(item.programId ?? "") ?? ""}`}
            >
              <RowNumber n={index + 1} />
              <Link href={`/admin/dokumentasi/${item.id}`} className="row-main group flex min-w-0 items-center gap-3.5">
                <span className="relative block aspect-video w-24 shrink-0 overflow-clip rounded-xl bg-[var(--adm-hover)] ring-1 ring-line">
                  {/* eslint-disable-next-line @next/next/no-img-element -- gambar mini YouTube */}
                  <img src={youtubeThumbnail(item.youtubeId)} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
                  <span aria-hidden className="absolute inset-0 grid place-items-center bg-black/15">
                    <Play className="size-4 text-white" fill="currentColor" />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-brand-teal-dark">{item.title}</span>
                  <span className="block truncate text-xs text-ink-soft">{programName.get(item.programId ?? "") ?? "Umum"}</span>
                </span>
              </Link>
              <div>
                <Badge tone={categoryTone[item.category] ?? "info"}>{item.category}</Badge>
              </div>
              <div className="text-[13px] text-ink-soft">{formatDateLongId(item.date)}</div>
              <div>
                <StatusBadge published={item.published} labels={["Tampil", "Disembunyikan"]} />
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={youtubeWatchUrl(item.youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buka video ${item.title} di YouTube`}
                  title="Buka di YouTube"
                  className="grid size-9 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink"
                >
                  <ExternalLink aria-hidden className="size-4" />
                </a>
                <RowActions
                  id={item.id}
                  label={`video ${item.title}`}
                  editHref={`/admin/dokumentasi/${item.id}`}
                  published={item.published}
                  toggleAction={toggleDocumentationAction}
                  deleteAction={deleteDocumentationAction}
                />
              </div>
            </ListRow>
          ))}
        </ListCard>
      )}
    </div>
  );
}
