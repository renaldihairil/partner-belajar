"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type DetailDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Nama jendela untuk pembaca layar. */
  label: string;
  children: ReactNode;
};

/** Jendela detail (dialog bawaan browser): tutup lewat tombol X, Esc, atau klik di luar. Dipakai Pengajar & Testimoni. */
export function DetailDialog({ open, onClose, label, children }: DetailDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="detail-dialog m-auto max-h-[88dvh] w-[min(92vw,36rem)] overflow-y-auto overscroll-contain rounded-[28px] border border-line bg-surface p-0 text-ink shadow-lift backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="relative">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Tutup"
            className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-panel text-ink ring-1 ring-line backdrop-blur transition-colors hover:bg-background"
          >
            <X aria-hidden className="size-5" />
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
