import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import { deleteProgramAction, moveProgramAction, toggleProgramAction } from "@/app/admin/actions/programs";
import { RowActions } from "@/components/admin/RowActions";
import { AddLink, AdminPageHeader, Badge, EmptyState, ListCard, ListRow, Notice, noticeMessages, StatusBadge } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { getClassStatus } from "@/lib/class-status";
import { toProgramClass } from "@/lib/programs-service";

export const metadata: Metadata = { title: "Program & Jadwal" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

export default async function AdminProgramsPage({ searchParams }: PageProps) {
  const { pesan } = await searchParams;
  const db = await requireDb();
  const [items, classes] = await Promise.all([
    db.select().from(schema.programs).orderBy(asc(schema.programs.sortOrder)),
    db.select().from(schema.programClasses),
  ]);
  const now = Date.now();

  return (
    <div className="adm-fade-in">
      <AdminPageHeader
        title="Program & Jadwal"
        description="Kelola isi program, paket harga, dan jadwal kelas. Urutan di sini sama dengan urutan tampil di situs."
        action={<AddLink href="/admin/program/baru">Tambah program</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      {items.length === 0 ? (
        <EmptyState action={<AddLink href="/admin/program/baru">Tambah program</AddLink>}>Belum ada program.</EmptyState>
      ) : (
        <ListCard title="Semua program" count={items.length}>
          {items.map((item, index) => {
            const own = classes.filter((c) => c.programId === item.id);
            const open = own.filter((c) => getClassStatus(toProgramClass(c), now) === "open").length;
            return (
              <ListRow key={item.id} muted={!item.published}>
                <Link href={`/admin/program/${item.id}`} className="row-main group flex min-w-0 flex-1 items-center gap-3.5">
                  <span className={`theme-${item.theme} program-surface grid size-12 shrink-0 place-items-center overflow-clip rounded-lg ring-1 ring-line`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail dari lokal / Blob */}
                    <img src={item.image} alt="" className="size-10 object-contain" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-sm font-semibold text-ink group-hover:text-brand-teal-dark">
                      {item.title}
                      <ChevronRight aria-hidden className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                    <span className="block truncate text-[13px] text-ink-soft">
                      {item.category} · {item.ageRange} · kode {item.code}
                    </span>
                  </span>
                </Link>
                <div className="flex flex-wrap items-center gap-2 md:w-64 md:justify-end">
                  <Link
                    href={`/admin/program/${item.id}/kelas`}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink"
                  >
                    <CalendarDays aria-hidden className="size-4" />
                    {own.length} jadwal
                  </Link>
                  {open > 0 && (
                    <Badge tone="success" dot>
                      {open} dibuka
                    </Badge>
                  )}
                  <StatusBadge published={item.published} />
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
