import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { deleteProgramAction, moveProgramAction, toggleProgramAction } from "@/app/admin/actions/programs";
import { RowActions } from "@/components/admin/RowActions";
import { AddLink, AdminPageHeader, Badge, EmptyState, Notice, noticeMessages } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { getClassStatus } from "@/lib/class-status";
import { toProgramClass } from "@/lib/programs-service";

export const metadata: Metadata = { title: "Program" };

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
    <>
      <AdminPageHeader
        title="Program & Jadwal"
        description="Kelola isi program, paket harga, dan jadwal kelas. Urutan di sini = urutan tampil di situs."
        action={<AddLink href="/admin/program/baru">Tambah program</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      {items.length === 0 ? (
        <EmptyState>Belum ada program.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {items.map((item, index) => {
            const own = classes.filter((c) => c.programId === item.id);
            const open = own.filter((c) => getClassStatus(toProgramClass(c), now) === "open").length;
            return (
              <li key={item.id} className={`rounded-[20px] border border-line bg-surface p-4 shadow-soft ${item.published ? "" : "opacity-70"}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`theme-${item.theme} program-surface grid size-16 shrink-0 place-items-center overflow-clip rounded-2xl`}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail kecil dari lokal / Blob */}
                      <img src={item.image} alt="" className="size-14 object-contain" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-ink">{item.title}</p>
                        {!item.published && <Badge tone="warning">Disembunyikan</Badge>}
                      </div>
                      <p className="text-sm text-ink-soft">
                        {item.category} · {item.ageRange} · kode {item.code}
                      </p>
                      <Link
                        href={`/admin/program/${item.id}/kelas`}
                        className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal-dark hover:underline"
                      >
                        <CalendarDays aria-hidden className="size-4" />
                        {own.length} jadwal kelas{open ? `, ${open} dibuka` : ""}
                      </Link>
                    </div>
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
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
