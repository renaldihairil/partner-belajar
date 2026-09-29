import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Database, ImageIcon, Plus } from "lucide-react";
import type { ProgramClassRow } from "@/db/schema";
import { statusLabel } from "@/lib/class-status";
import { formatDateId } from "@/lib/format";
import type { RegistrationStatus } from "@/types";
import { Badge } from "./ui";

const statusTone: Record<RegistrationStatus, "success" | "info" | "warning" | "neutral"> = {
  open: "success",
  upcoming: "info",
  full: "warning",
  closed: "neutral",
};

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="overflow-clip rounded-2xl border border-line bg-surface shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

type Upcoming = { row: ProgramClassRow; status: RegistrationStatus; programTitle: string };

export function DashboardUpcoming({ items }: { items: Upcoming[] }) {
  return (
    <div className="min-w-0">
      <Panel
        title="Jadwal kelas terdekat"
        action={
          <Link href="/admin/program" className="inline-flex items-center gap-1 text-[13px] font-medium text-brand-teal-dark hover:underline">
            Kelola <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        }
      >
        {items.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">Belum ada jadwal kelas yang akan datang.</p>
        ) : (
          <ul className="divide-y divide-line">
            {items.map(({ row, status, programTitle }) => {
              const fill = Math.min(100, Math.round((row.enrolled / row.quota) * 100));
              return (
                <li key={row.id}>
                  <Link
                    href={`/admin/program/${row.programId}/kelas/${row.id}`}
                    className="flex flex-col gap-2 px-5 py-3.5 transition-colors hover:bg-[var(--adm-hover)]/60 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{row.name}</span>
                      <span className="block truncate text-xs text-ink-soft">
                        {programTitle} · mulai {formatDateId(row.classStarts)}
                      </span>
                    </span>
                    <Badge tone={statusTone[status]} dot>
                      {statusLabel[status]}
                    </Badge>
                    <span className="w-28 shrink-0">
                      <span className="block text-right text-xs text-ink-soft tabular-nums">
                        {row.enrolled}/{row.quota} kursi
                      </span>
                      <span className="mt-1 block h-1.5 overflow-clip rounded-full bg-[var(--adm-hover)]">
                        <span className={`block h-full rounded-full ${fill >= 100 ? "bg-amber-500" : "bg-brand-teal"}`} style={{ width: `${fill}%` }} />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { href: "/admin/program", label: "Atur jadwal kelas" },
          { href: "/admin/pengajar/baru", label: "Tambah pengajar" },
          { href: "/admin/testimoni/baru", label: "Tambah testimoni" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-2.5 rounded-2xl border border-dashed border-line bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-brand-teal/50 hover:bg-brand-teal-soft/40"
          >
            <span className="grid size-7 place-items-center rounded-md bg-brand-teal-soft text-brand-teal-dark">
              <Plus aria-hidden className="size-4" />
            </span>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatusLine({ ok, icon: Icon, label, detail }: { ok: boolean; icon: typeof Database; label: string; detail: string }) {
  return (
    <li className="flex items-start gap-3 px-5 py-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--adm-hover)] text-ink-soft">
        <Icon aria-hidden className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-xs text-ink-soft">{detail}</span>
      </span>
      {ok ? <CheckCircle2 aria-label="Aktif" className="mt-1 size-4 text-emerald-500" /> : <CircleAlert aria-label="Perlu tindakan" className="mt-1 size-4 text-amber-500" />}
    </li>
  );
}

export function DashboardSystem({ storage }: { storage: boolean }) {
  return (
    <Panel title="Status sistem">
      <ul className="divide-y divide-line">
        <StatusLine ok icon={Database} label="Database" detail="Terhubung" />
        <StatusLine ok={storage} icon={ImageIcon} label="Penyimpanan foto" detail={storage ? "Siap untuk upload" : "Hubungkan Vercel Blob"} />
      </ul>
    </Panel>
  );
}

function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

type Activity = { kind: string; name: string; href: string; at: string };

export function DashboardActivity({ items }: { items: Activity[] }) {
  return (
    <Panel title="Terakhir diperbarui">
      <ul className="divide-y divide-line">
        {items.map((a) => (
          <li key={`${a.kind}-${a.href}`}>
            <Link href={a.href} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--adm-hover)]/60">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">{a.name}</span>
                <span className="block text-xs text-ink-soft">{a.kind}</span>
              </span>
              <span className="shrink-0 text-xs text-ink-soft">{timeAgo(a.at)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
