"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Trash2 } from "lucide-react";

const iconBtn =
  "grid size-9 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40 disabled:pointer-events-none disabled:opacity-30";

/** Tombol edit (abu-abu lembut) & hapus (merah lembut) — sama seperti tabel di desain. */
const editBtn = "grid size-9 place-items-center rounded-lg bg-[var(--adm-hover)] text-ink transition-colors hover:bg-brand-teal-soft hover:text-brand-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40";
const deleteBtn = "grid size-9 place-items-center rounded-lg bg-red-50 text-red-500 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 dark:bg-red-950/40 dark:hover:bg-red-950/70";

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
    <div className="flex shrink-0 items-center gap-1">
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
      <Link href={editHref} className={editBtn} aria-label={`Edit ${label}`} title="Edit">
        <Pencil aria-hidden className="size-4" />
      </Link>
      <form
        action={deleteAction}
        onSubmit={(event) => {
          if (!window.confirm(deleteMessage ?? `Hapus "${label}"? Tindakan ini tidak bisa dibatalkan.`)) event.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button type="submit" className={deleteBtn} aria-label={`Hapus ${label}`} title="Hapus">
          <PendingIcon>
            <Trash2 aria-hidden className="size-4" />
          </PendingIcon>
        </button>
      </form>
    </div>
  );
}
