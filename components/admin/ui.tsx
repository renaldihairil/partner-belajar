import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ArrowLeft, Inbox, Plus } from "lucide-react";
import { NoticeToast } from "./Toaster";

/** Judul halaman admin + aksi utama di kanan. */
export function AdminPageHeader({
  title,
  description,
  back,
  action,
}: {
  title: string;
  description?: ReactNode;
  back?: { href: string; label: string };
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 md:mb-8">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink">
          <ArrowLeft aria-hidden className="size-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold tracking-tight text-ink md:text-2xl">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-ink-soft">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export const buttonPrimary =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-brand-teal-strong px-3.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_1px_2px_rgb(16_32_31/0.2)] transition-all hover:brightness-110 active:translate-y-px disabled:cursor-wait disabled:opacity-70";

export const buttonSecondary =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-3.5 text-sm font-medium text-ink shadow-soft transition-colors hover:bg-[var(--adm-hover)]";

export function AddLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={buttonPrimary}>
      <Plus aria-hidden className="size-4" />
      {children}
    </Link>
  );
}

const badgeTones = {
  neutral: "bg-[var(--adm-hover)] text-ink-soft",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  danger: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  info: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
};

const dotTones = {
  neutral: "bg-ink-soft/60",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
};

export function Badge({ tone = "neutral", dot, children }: { tone?: keyof typeof badgeTones; dot?: boolean; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap ${badgeTones[tone]}`}>
      {dot && <span aria-hidden className={`size-1.5 rounded-full ${dotTones[tone]}`} />}
      {children}
    </span>
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <Badge tone="success" dot>
      Tampil
    </Badge>
  ) : (
    <Badge tone="neutral" dot>
      Disembunyikan
    </Badge>
  );
}

export function EmptyState({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-[var(--adm-hover)] text-ink-soft">
        <Inbox aria-hidden className="size-5" />
      </span>
      <p className="mt-3 max-w-sm text-sm text-ink-soft">{children}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Kartu daftar dengan kepala (judul + jumlah) dan baris-baris data. */
export function ListCard({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <div className="overflow-clip rounded-xl border border-line bg-surface shadow-soft">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 md:px-5">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <span className="text-xs text-ink-soft">{count} data</span>
      </div>
      <ul className="divide-y divide-line">{children}</ul>
    </div>
  );
}

export function ListRow({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return (
    <li
      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 px-4 py-3.5 transition-colors hover:bg-[var(--adm-hover)]/60 md:flex md:px-5 [&>.row-main]:col-span-2 md:[&>.row-main]:col-span-1 ${
        muted ? "[&_.row-main]:opacity-60" : ""
      }`}
    >
      {children}
    </li>
  );
}

/** Pemberitahuan singkat dari query string (mis. ?pesan=tersimpan), ditampilkan sebagai toast. */
export function Notice({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Suspense>
      <NoticeToast message={message} />
    </Suspense>
  );
}

export const noticeMessages: Record<string, string> = {
  tersimpan: "Perubahan berhasil disimpan.",
  dibuat: "Data baru berhasil dibuat.",
  dihapus: "Data berhasil dihapus.",
  "tanpa-akses": "Akun Anda tidak punya akses ke menu tersebut.",
};
