import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { BookOpen, CalendarCheck2, CalendarDays, ChevronRight, Eye, Layers } from "lucide-react";
import { deleteProgramAction, moveProgramAction, toggleProgramAction } from "@/app/admin/actions/programs";
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
  themeTone,
} from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { getClassStatus } from "@/lib/class-status";
import { toProgramClass } from "@/lib/programs-service";

export const metadata: Metadata = { title: "Program & Jadwal" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

const GRID = "@3xl:grid-cols-[2.5rem_minmax(0,1fr)_9rem_9rem_8rem_13rem]";

export default async function AdminProgramsPage({ searchParams }: PageProps) {
  const { pesan } = await searchParams;
  const db = await requireDb();
  const [items, classes] = await Promise.all([
    db.select().from(schema.programs).orderBy(asc(schema.programs.sortOrder)),
    db.select().from(schema.programClasses),
  ]);
  const now = Date.now();
  const openCount = classes.filter((c) => getClassStatus(toProgramClass(c), now) === "open").length;

  return (
    <div className="adm-fade-in">
      <AdminPageHeader
        title="Program & Jadwal"
        description="Kelola isi program, paket harga, dan jadwal kelas. Urutan di sini sama dengan urutan tampil di situs."
        searchPlaceholder="Cari program..."
        action={<AddLink href="/admin/program/baru">Tambah Program</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      <StatCards
        items={[
          { label: "Total program", value: items.length, icon: BookOpen, tone: "teal" },
          { label: "Tampil di situs", value: items.filter((p) => p.published).length, icon: Eye, tone: "green" },
          { label: "Total jadwal kelas", value: classes.length, icon: Layers, tone: "blue" },
          { label: "Kelas dibuka", value: openCount, icon: CalendarCheck2, tone: "yellow" },
        ]}
      />
      {items.length === 0 ? (
        <EmptyState action={<AddLink href="/admin/program/baru">Tambah Program</AddLink>}>Belum ada program.</EmptyState>
      ) : (
        <ListCard count={items.length} head={["No", "Program", "Kategori", "Jadwal", "Status", "Aksi"]} cols={GRID}>
          {items.map((item, index) => {
            const own = classes.filter((c) => c.programId === item.id);
            const open = own.filter((c) => getClassStatus(toProgramClass(c), now) === "open").length;
            return (
              <ListRow key={item.id} muted={!item.published} cols={GRID} search={`${item.title} ${item.category} ${item.code} ${item.ageRange}`}>
                <RowNumber n={index + 1} />
                <Link href={`/admin/program/${item.id}`} className="row-main group flex min-w-0 items-center gap-3.5">
                  <span className={`theme-${item.theme} program-surface grid size-14 shrink-0 place-items-center overflow-clip rounded-xl ring-1 ring-line`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail dari lokal / Blob */}
                    <img src={item.image} alt="" className="size-12 object-contain" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-sm font-semibold text-ink group-hover:text-brand-teal-dark">
                      {item.title}
                      <ChevronRight aria-hidden className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                    <span className="block truncate text-[13px] text-ink-soft">
                      {item.ageRange} · kode {item.code}
                    </span>
                  </span>
                </Link>
                <div>
                  <Badge tone={themeTone[item.theme] ?? "teal"}>{item.category}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Link
                    href={`/admin/program/${item.id}/kelas`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink"
                  >
                    <CalendarDays aria-hidden className="size-4" />
                    {own.length} jadwal
                  </Link>
                  {open > 0 && (
                    <Badge tone="success" dot>
                      {open} dibuka
                    </Badge>
                  )}
                </div>
                <div>
                  <StatusBadge published={item.published} labels={["Aktif", "Disembunyikan"]} />
                </div>
                <RowActions
                  id={item.id}
                  label={item.title}
                  editHref={`/admin/program/${item.id}`}
                  published={item.published}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  moveAction={moveProgramAction}
                  toggleAction={toggleProgramAction}
                  deleteAction={deleteProgramAction}
                  deleteMessage={`Hapus program "${item.title}" beserta semua jadwal kelasnya? Tindakan ini tidak bisa dibatalkan. Jika hanya ingin menyembunyikan, gunakan tombol mata.`}
                />
              </ListRow>
            );
          })}
        </ListCard>
      )}
    </div>
  );
}
