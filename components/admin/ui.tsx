import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Plus } from "lucide-react";

/** Judul halaman admin + tombol aksi di kanan. */
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
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-brand-teal-dark">
          <ArrowLeft aria-hidden className="size-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-[28px]">{title}</h1>
          {description && <p className="mt-1 text-sm text-ink-soft md:text-[15px]">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function AddLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-teal-strong px-5 text-sm font-semibold text-white shadow-soft transition-all hover:brightness-110"
    >
      <Plus aria-hidden className="size-4" />
      {children}
    </Link>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "success" | "warning" | "danger" | "info"; children: ReactNode }) {
  const tones = {
    neutral: "bg-background text-ink-soft ring-1 ring-line",
    success: "bg-brand-teal-soft text-brand-teal-dark",
    warning: "bg-brand-yellow-soft text-warn",
    danger: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    info: "bg-soft-blue text-ink",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-[22px] border border-dashed border-line bg-surface p-8 text-center text-sm text-ink-soft">{children}</p>;
}

/** Pemberitahuan singkat dari query string (mis. ?pesan=tersimpan). */
export function Notice({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="status" className="mb-5 rounded-xl bg-brand-teal-soft px-4 py-3 text-sm font-semibold text-brand-teal-dark">
      {message}
    </p>
  );
}

export const noticeMessages: Record<string, string> = {
  tersimpan: "Perubahan berhasil disimpan.",
  dibuat: "Data baru berhasil dibuat.",
  dihapus: "Data berhasil dihapus.",
};
