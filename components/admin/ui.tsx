import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ArrowLeft, Inbox, Plus, type LucideIcon } from "lucide-react";
import { ListSearch } from "./ListSearch";
import { NoticeToast } from "./Toaster";

/** Judul halaman admin + (opsional) pencarian daftar dan aksi utama di kanan. */
export function AdminPageHeader({
  title,
  description,
  back,
  action,
  searchPlaceholder,
}: {
  title: string;
  description?: ReactNode;
  back?: { href: string; label: string };
  action?: ReactNode;
  /** Bila diisi, tampil kotak cari yang menyaring baris daftar di halaman ini. */
  searchPlaceholder?: string;
}) {
  return (
    <div className="mb-6 md:mb-7">
      {back && (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden className="size-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-[28px]">
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-ink-soft">
              {description}
            </p>
          )}
        </div>
        {(searchPlaceholder || action) && (
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            {searchPlaceholder && (
              <ListSearch placeholder={searchPlaceholder} />
            )}
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

export const buttonPrimary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-teal-strong px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_2px_6px_-1px_rgb(14_127_122/0.35)] transition-all hover:brightness-110 active:translate-y-px disabled:cursor-wait disabled:opacity-70";

export const buttonSecondary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink shadow-soft transition-colors hover:bg-[var(--adm-hover)]";

/** Tombol tambah data — kuning cerah seperti aksen utama situs. */
export function AddLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-yellow px-4 text-sm font-bold text-[#3b2a00] shadow-[0_2px_8px_-2px_rgb(233_169_0/0.55)] transition-all hover:-translate-y-px hover:brightness-105 active:translate-y-0"
    >
      <Plus aria-hidden className="size-4" strokeWidth={2.75} />
      {children}
    </Link>
  );
}

const badgeTones = {
  neutral: "bg-[var(--adm-hover)] text-ink-soft",
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  danger: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  info: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
  teal: "bg-brand-teal-soft text-brand-teal-dark",
  orange:
    "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  purple:
    "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
};

const dotTones = {
  neutral: "bg-ink-soft/60",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
  teal: "bg-brand-teal",
  orange: "bg-orange-500",
  purple: "bg-violet-500",
};

export type BadgeTone = keyof typeof badgeTones;

export function Badge({
  tone = "neutral",
  dot,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${badgeTones[tone]}`}
    >
      {dot && (
        <span
          aria-hidden
          className={`size-1.5 rounded-full ${dotTones[tone]}`}
        />
      )}
      {children}
    </span>
  );
}

/** Warna badge per tema program (biru/kuning/hijau/ungu) dan kategori umum. */
export const themeTone: Record<string, BadgeTone> = {
  blue: "info",
  yellow: "orange",
  green: "success",
  purple: "purple",
};

export function StatusBadge({
  published,
  labels = ["Tampil", "Disembunyikan"],
}: {
  published: boolean;
  labels?: [string, string];
}) {
  return published ? (
    <Badge tone="success" dot>
      {labels[0]}
    </Badge>
  ) : (
    <Badge tone="warning" dot>
      {labels[1]}
    </Badge>
  );
}

export function EmptyState({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand-teal-soft text-brand-teal-dark">
        <Inbox aria-hidden className="size-5" />
      </span>
      <p className="mt-3 max-w-sm text-sm text-ink-soft">{children}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

const statTones = {
  teal: {
    card: "bg-brand-teal-soft/70",
    icon: "bg-brand-teal-strong text-white",
  },
  blue: { card: "bg-sky-50 dark:bg-sky-950/30", icon: "bg-sky-500 text-white" },
  yellow: {
    card: "bg-amber-50 dark:bg-amber-950/25",
    icon: "bg-brand-yellow text-[#3b2a00]",
  },
  green: {
    card: "bg-emerald-50 dark:bg-emerald-950/25",
    icon: "bg-emerald-500 text-white",
  },
  purple: {
    card: "bg-violet-50 dark:bg-violet-950/25",
    icon: "bg-violet-500 text-white",
  },
} as const;

export type StatTone = keyof typeof statTones;
export type StatItem = {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  tone?: StatTone;
  note?: string;
  href?: string;
};

/** Deretan kartu ringkasan berwarna lembut (Total, Aktif, Draf, …). */
export function StatCards({ items }: { items: StatItem[] }) {
  return (
    <div className="@container mb-6">
      <ul
        className={`grid grid-cols-2 gap-3 @3xl:gap-4 ${items.length >= 5 ? "@3xl:grid-cols-3 @5xl:grid-cols-5" : items.length === 4 ? "@3xl:grid-cols-4" : items.length === 3 ? "@3xl:grid-cols-3" : ""}`}
      >
        {items.map(
          ({ label, value, icon: Icon, tone = "teal", note, href }) => {
            const body = (
              <>
                <span
                  aria-hidden
                  className={`grid size-11 shrink-0 place-items-center rounded-2xl shadow-soft ${statTones[tone].icon}`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium text-ink-soft">
                    {label}
                  </span>
                  <span className="block text-2xl leading-tight font-bold text-ink tabular-nums">
                    {value}
                  </span>
                  {note && (
                    <span className="block truncate text-xs text-ink-soft">
                      {note}
                    </span>
                  )}
                </span>
              </>
            );
            const cls = `flex items-center gap-3.5 rounded-2xl border border-white/70 p-4 shadow-soft transition-all dark:border-white/5 ${statTones[tone].card}`;
            return (
              <li key={label}>
                {href ? (
                  <Link
                    href={href}
                    className={`${cls} hover:-translate-y-0.5 hover:shadow-lift`}
                  >
                    {body}
                  </Link>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </li>
            );
          },
        )}
      </ul>
    </div>
  );
}

/**
 * Tabel daftar: kepala kolom (layar lebar) + baris. `cols` = kelas grid template yang SAMA
 * dipakai di <ListRow cols=…> agar kolom sejajar, mis. "md:grid-cols-[2.5rem_minmax(0,1fr)_9rem_auto]".
 */
export function ListCard({
  title,
  count,
  head,
  cols,
  children,
}: {
  title?: string;
  count: number;
  head?: string[];
  cols?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="@container overflow-clip rounded-2xl border border-white/80 bg-surface shadow-soft dark:border-line"
      data-list
    >
      {title && (
        <div className="flex items-center justify-between px-5 pt-4 pb-1">
          <p className="text-sm font-semibold text-ink">{title}</p>
          <span className="text-xs text-ink-soft" data-list-count>
            {count} data
          </span>
        </div>
      )}
      {head && (
        <div
          className={`hidden items-center gap-x-4 bg-[var(--adm-hover)]/70 px-5 py-2.5 text-xs font-semibold text-ink-soft @3xl:grid ${cols ?? ""}`}
        >
          {head.map((label, i) => (
            <span key={`${label}-${i}`}>{label}</span>
          ))}
        </div>
      )}
      <ul className="divide-y divide-line">{children}</ul>
      <p
        data-list-empty
        hidden
        className="px-5 py-10 text-center text-sm text-ink-soft"
      >
        Tidak ada data yang cocok dengan pencarian.
      </p>
    </div>
  );
}

export function ListRow({
  children,
  muted,
  cols,
  search,
}: {
  children: ReactNode;
  muted?: boolean;
  cols?: string;
  search?: string;
}) {
  return (
    <li
      data-row
      data-search={search?.toLowerCase()}
      className={`flex flex-wrap items-center gap-x-4 gap-y-2.5 px-4 py-3.5 transition-colors hover:bg-brand-teal-soft/30 @3xl:px-5 ${
        cols ? `@3xl:grid @3xl:flex-nowrap ${cols}` : ""
      } [&>.row-main]:basis-full @3xl:[&>.row-main]:basis-auto [&>:last-child]:ml-auto @3xl:[&>:last-child]:ml-0 ${muted ? "[&_.row-main]:opacity-60" : ""}`}
    >
      {children}
    </li>
  );
}

/** Nomor urut di kolom pertama tabel (disembunyikan di HP). */
export function RowNumber({ n }: { n: number }) {
  return (
    <span className="hidden text-sm font-medium text-ink-soft tabular-nums @3xl:block">
      {n}
    </span>
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
  "link-dibuat": "Link testimoni berhasil dibuat. Salin lalu bagikan ke orang tua.",
  "link-dihapus": "Link dihapus. Testimoni yang sudah masuk tetap tampil di situs.",
  "program-tidak-ada": "Program tidak ditemukan.",
  "link-guru-dibuat": "Link form guru berhasil dibuat. Salin lalu bagikan ke para guru.",
  "link-guru-dibuat-pin": "Link form guru berhasil dibuat. Kirim link dan PIN-nya ke para guru (terpisah).",
  "pin-dihapus": "PIN dihapus. Link kini bisa dibuka tanpa PIN.",
  "link-guru-dihapus": "Link dihapus. Data guru yang sudah masuk tetap tersimpan.",
  "pin-diganti": "PIN berhasil diganti. PIN lama tidak berlaku lagi.",
  "pin-tidak-valid": "PIN harus terdiri dari 4 sampai 8 angka.",
};
