import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { deleteClassAction } from "@/app/admin/actions/programs";
import { RowActions } from "@/components/admin/RowActions";
import { AddLink, Badge, EmptyState, ListCard, ListRow, Notice, noticeMessages } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { getClassStatus, modeLabel, seatsLeft, statusLabel } from "@/lib/class-status";
import { formatDateId, formatDays } from "@/lib/format";
import { toProgramClass } from "@/lib/programs-service";
import type { RegistrationStatus } from "@/types";

export const metadata: Metadata = { title: "Jadwal kelas" };

const statusTone: Record<RegistrationStatus, "success" | "info" | "warning" | "neutral"> = {
  open: "success",
  upcoming: "info",
  full: "warning",
  closed: "neutral",
};

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ pesan?: string }> };

export default async function ProgramClassesPage({ params, searchParams }: PageProps) {
  const [{ id }, { pesan }] = await Promise.all([params, searchParams]);
  const db = await requireDb();
  const rows = await db
    .select()
    .from(schema.programClasses)
    .where(eq(schema.programClasses.programId, id))
    .orderBy(asc(schema.programClasses.classStarts));
  const now = Date.now();
  const addLink = <AddLink href={`/admin/program/${id}/kelas/baru`}>Tambah kelas</AddLink>;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-ink-soft">
          Status dihitung otomatis dari tanggal & kuota. Perbarui jumlah <span className="font-medium text-ink">sudah terdaftar</span> setiap ada
          siswa baru.
        </p>
        {addLink}
      </div>
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      {rows.length === 0 ? (
        <EmptyState action={addLink}>Belum ada jadwal kelas. Di situs, program ini menampilkan tombol untuk menanyakan jadwal berikutnya.</EmptyState>
      ) : (
        <ListCard title="Jadwal kelas" count={rows.length}>
          {rows.map((row) => {
            const item = toProgramClass(row);
            const status = getClassStatus(item, now);
            const fill = Math.min(100, Math.round((row.enrolled / row.quota) * 100));
            return (
              <ListRow key={row.id}>
                <Link href={`/admin/program/${id}/kelas/${row.id}`} className="row-main group min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-ink group-hover:text-brand-teal-dark">{row.name}</span>
                    <Badge tone={statusTone[status]} dot>
                      {statusLabel[status]}
                    </Badge>
                    {row.manuallyClosed && <Badge tone="danger">Ditutup manual</Badge>}
                  </span>
                  <span className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink-soft">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays aria-hidden className="size-3.5" />
                      Daftar {formatDateId(row.registrationOpens)} s.d. {formatDateId(row.registrationCloses)} · mulai {formatDateId(row.classStarts)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock aria-hidden className="size-3.5" />
                      {formatDays(row.days)}, {row.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin aria-hidden className="size-3.5" />
                      {modeLabel[row.mode]}
                      {row.location ? `, ${row.location}` : ""}
                    </span>
                  </span>
                </Link>
                <div className="md:w-44">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink">
                      {row.enrolled}/{row.quota} terdaftar
                    </span>
                    <span className="text-ink-soft">sisa {seatsLeft(item)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-clip rounded-full bg-[var(--adm-hover)]">
                    <div className={`h-full rounded-full ${fill >= 100 ? "bg-amber-500" : "bg-brand-teal"}`} style={{ width: `${fill}%` }} />
                  </div>
                </div>
                <RowActions id={row.id} label={row.name} editHref={`/admin/program/${id}/kelas/${row.id}`} deleteAction={deleteClassAction} />
              </ListRow>
            );
          })}
        </ListCard>
      )}
    </>
  );
}
