import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { BookOpenText, CircleCheckBig, EyeOff, ExternalLink, Library } from "lucide-react";
import { deleteModuleAction, moveModuleAction, toggleModuleAction } from "@/app/admin/actions/modules";
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

export const metadata: Metadata = { title: "Modul Belajar" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

const GRID = "@3xl:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,12rem)_8rem_14rem]";

/** "https://drive.google.com/file/d/abc" → "drive.google.com" */
function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function AdminModulesPage({ searchParams }: PageProps) {
  const { pesan } = await searchParams;
  const db = await requireDb();
  const [items, programs] = await Promise.all([
    db.select().from(schema.learningModules).orderBy(asc(schema.learningModules.sortOrder), asc(schema.learningModules.createdAt)),
    programOptions(),
  ]);
  const programName = new Map(programs.map((p) => [p.value, p.label]));
  const live = items.filter((m) => m.published).length;

  return (
    <div className="adm-fade-in">
      <AdminPageHeader
        title="Modul Belajar"
        description="Buku dan kitab yang dipakai belajar di bimbel, tampil di halaman Modul Belajar lengkap dengan tombol unduh. Urutan di sini sama dengan urutan tampil."
        searchPlaceholder="Cari modul..."
        action={<AddLink href="/admin/modul/baru">Tambah Modul</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      <StatCards
        items={[
          { label: "Total modul", value: items.length, icon: Library, tone: "teal" },
          { label: "Tampil di situs", value: live, icon: CircleCheckBig, tone: "green" },
          { label: "Disembunyikan", value: items.length - live, icon: EyeOff, tone: "yellow" },
          { label: "Tanpa sampul", value: items.filter((m) => !m.cover).length, icon: BookOpenText, tone: "purple" },
        ]}
      />
      {items.length === 0 ? (
        <EmptyState action={<AddLink href="/admin/modul/baru">Tambah Modul</AddLink>}>Belum ada modul belajar.</EmptyState>
      ) : (
        <ListCard count={items.length} head={["No", "Modul", "Program", "Status", "Aksi"]} cols={GRID}>
          {items.map((item, index) => (
            <ListRow
              key={item.id}
              muted={!item.published}
              cols={GRID}
              search={`${item.title} ${programName.get(item.programId ?? "") ?? ""}`}
            >
              <RowNumber n={index + 1} />
              <Link href={`/admin/modul/${item.id}`} className="row-main group flex min-w-0 items-center gap-3.5">
                <span className="relative grid size-14 shrink-0 place-items-center overflow-clip rounded-xl bg-[var(--adm-hover)] ring-1 ring-line">
                  {item.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element -- sampul dari Blob / lokal
                    <img src={item.cover} alt="" className="size-full object-cover" loading="lazy" />
                  ) : (
                    <Library aria-hidden className="size-5 text-ink-soft/60" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-1 text-sm font-semibold text-ink group-hover:text-brand-teal-dark">{item.title}</span>
                  <span className="block truncate text-xs text-ink-soft/80">{hostOf(item.downloadUrl)}</span>
                </span>
              </Link>
              <div>
                {item.programId && programName.has(item.programId) ? (
                  <Badge tone="info">{programName.get(item.programId)}</Badge>
                ) : (
                  <span className="text-xs text-ink-soft">Umum</span>
                )}
              </div>
              <div>
                <StatusBadge published={item.published} labels={["Tampil", "Disembunyikan"]} />
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={item.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Coba tautan unduh ${item.title}`}
                  title="Coba tautan unduh"
                  className="grid size-9 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink"
                >
                  <ExternalLink aria-hidden className="size-4" />
                </a>
                <RowActions
                  id={item.id}
                  label={`modul ${item.title}`}
                  editHref={`/admin/modul/${item.id}`}
                  published={item.published}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  moveAction={moveModuleAction}
                  toggleAction={toggleModuleAction}
                  deleteAction={deleteModuleAction}
                />
              </div>
            </ListRow>
          ))}
        </ListCard>
      )}
    </div>
  );
}
