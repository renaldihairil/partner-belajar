"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Trash2 } from "lucide-react";

const iconBtn =
  "grid size-8 place-items-center rounded-md text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40 disabled:pointer-events-none disabled:opacity-30";

function PendingIcon({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <>{children}</>;
}

type RowActionsProps = {
  id: string;
  editHref: string;
  label: string;
  published?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  moveAction?: (formData: FormData) => void | Promise<void>;
  toggleAction?: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
  deleteMessage?: string;
};

/** Tombol aksi per baris: urutkan, tampil/sembunyi, edit, hapus (dengan konfirmasi). */
export function RowActions({
  id,
  editHref,
  label,
  published,
  isFirst,
  isLast,
  moveAction,
  toggleAction,
  deleteAction,
  deleteMessage,
}: RowActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-line bg-surface p-0.5 shadow-soft">
      {moveAction && (
        <>
          <form action={moveAction}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="direction" value="up" />
            <button type="submit" className={iconBtn} disabled={isFirst} aria-label={`Naikkan urutan ${label}`} title="Naikkan">
              <PendingIcon>
                <ArrowUp aria-hidden className="size-4" />
              </PendingIcon>
            </button>
          </form>
          <form action={moveAction}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="direction" value="down" />
            <button type="submit" className={iconBtn} disabled={isLast} aria-label={`Turunkan urutan ${label}`} title="Turunkan">
              <PendingIcon>
                <ArrowDown aria-hidden className="size-4" />
              </PendingIcon>
            </button>
          </form>
        </>
      )}
      {toggleAction && (
        <form action={toggleAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="published" value={published ? "" : "on"} />
          <button
            type="submit"
            className={iconBtn}
            aria-label={published ? `Sembunyikan ${label} dari situs` : `Tampilkan ${label} di situs`}
            title={published ? "Sembunyikan dari situs" : "Tampilkan di situs"}
          >
            <PendingIcon>{published ? <Eye aria-hidden className="size-4" /> : <EyeOff aria-hidden className="size-4" />}</PendingIcon>
          </button>
        </form>
      )}
      <Link href={editHref} className={iconBtn} aria-label={`Edit ${label}`} title="Edit">
        <Pencil aria-hidden className="size-4" />
      </Link>
      <span aria-hidden className="mx-0.5 h-4 w-px bg-line" />
      <form
        action={deleteAction}
        onSubmit={(event) => {
          if (!window.confirm(deleteMessage ?? `Hapus "${label}"? Tindakan ini tidak bisa dibatalkan.`)) event.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button type="submit" className={`${iconBtn} hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40`} aria-label={`Hapus ${label}`} title="Hapus">
          <PendingIcon>
            <Trash2 aria-hidden className="size-4" />
          </PendingIcon>
        </button>
      </form>
    </div>
  );
}
