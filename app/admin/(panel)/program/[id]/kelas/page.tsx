import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { deleteClassAction } from "@/app/admin/actions/programs";
import { RowActions } from "@/components/admin/RowActions";
import { AddLink, Badge, EmptyState, Notice, noticeMessages } from "@/components/admin/ui";
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

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-ink-soft">
          Status dihitung otomatis dari tanggal & kuota. Perbarui jumlah <strong>sudah terdaftar</strong> setiap ada siswa baru.
        </p>
        <AddLink href={`/admin/program/${id}/kelas/baru`}>Tambah kelas</AddLink>
      </div>
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      {rows.length === 0 ? (
        <EmptyState>Belum ada jadwal kelas. Di situs, program ini akan menampilkan tombol untuk bertanya jadwal berikutnya.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {rows.map((row) => {
            const item = toProgramClass(row);
            const status = getClassStatus(item, now);
            return (
              <li key={row.id} className="rounded-[20px] border border-line bg-surface p-4 shadow-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-ink">{row.name}</p>
                      <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
                      {row.manuallyClosed && <Badge tone="danger">Ditutup manual</Badge>}
                    </div>
                    <ul className="mt-2 grid gap-1 text-sm text-ink-soft sm:grid-cols-2">
                      <li className="flex items-center gap-1.5">
                        <CalendarDays aria-hidden className="size-4 shrink-0" />
                        Daftar {formatDateId(row.registrationOpens)} sampai {formatDateId(row.registrationCloses)}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CalendarDays aria-hidden className="size-4 shrink-0" />
                        Mulai {formatDateId(row.classStarts)}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Clock aria-hidden className="size-4 shrink-0" />
                        {formatDays(row.days)}, {row.time}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <MapPin aria-hidden className="size-4 shrink-0" />
                        {modeLabel[row.mode]}
                        {row.location ? `, ${row.location}` : ""}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Users aria-hidden className="size-4 shrink-0" />
                        {row.enrolled}/{row.quota} terdaftar, sisa {seatsLeft(item)} kursi
                      </li>
                    </ul>
                  </div>
                  <RowActions
                    id={row.id}
                    label={row.name}
                    editHref={`/admin/program/${id}/kelas/${row.id}`}
                    deleteAction={deleteClassAction}
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
