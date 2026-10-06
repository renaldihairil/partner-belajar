"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { KeyRound, Loader2 } from "lucide-react";
import { changeTeacherLinkPinAction } from "@/app/admin/actions/teacher-links";
import { PinField } from "./PinField";
import { buttonPrimary, buttonSecondary } from "./ui";

function Save() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonPrimary}>
      {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
      {pending ? "Menyimpan…" : "Simpan PIN"}
    </button>
  );
}

/** Tombol kunci di baris link: membuka dialog untuk mengganti PIN. */
export function PinDialog({ id, label, hasPin }: { id: string; label: string; hasPin: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={`Atur PIN link ${label}`}
        title={hasPin ? "Atur PIN (saat ini memakai PIN)" : "Atur PIN (saat ini terbuka)"}
        className="grid size-9 place-items-center rounded-lg bg-[var(--adm-hover)] text-ink transition-colors hover:bg-brand-teal-soft hover:text-brand-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
      >
        <KeyRound aria-hidden className="size-4" />
      </button>
      <dialog
        ref={ref}
        aria-labelledby={`pin-title-${id}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) ref.current?.close();
        }}
        className="m-auto w-[min(92vw,26rem)] rounded-2xl border border-line bg-surface p-0 text-ink shadow-lift backdrop:bg-black/45"
      >
        <form action={changeTeacherLinkPinAction} className="grid gap-4 p-5 md:p-6">
          <input type="hidden" name="id" value={id} />
          <div>
            <h2 id={`pin-title-${id}`} className="text-base font-semibold text-ink">
              Atur PIN
            </h2>
            <p className="mt-0.5 text-[13px] text-ink-soft">{label}</p>
          </div>
          <PinField
            label="PIN baru"
            hint={
              hasPin
                ? "Kosongkan lalu simpan untuk menghapus PIN (link jadi terbuka). Guru yang sedang mengisi dengan PIN lama harus memasukkan PIN baru."
                : "Link ini terbuka tanpa PIN. Isi untuk mulai mewajibkan PIN."
            }
          />
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => ref.current?.close()} className={buttonSecondary}>
              Batal
            </button>
            <Save />
          </div>
        </form>
      </dialog>
    </>
  );
}
