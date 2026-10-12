"use client";

import { useRef, useState, useTransition } from "react";
import { Check, Copy, ExternalLink, Link2Off, Loader2, RefreshCw, UserPen } from "lucide-react";
import { createTeacherEditLinkAction, removeTeacherEditLinkAction, type EditLinkResult } from "@/app/admin/actions/teacher-edit-links";
import { copyText } from "@/lib/clipboard";
import { toast } from "./Toaster";
import { useLinkUrl, WhatsAppIcon } from "./ShareLinkActions";
import { buttonPrimary, buttonSecondary } from "./ui";

type Props = {
  id: string;
  name: string;
  /** Kode link pribadi saat ini (null = belum dibuat). */
  initialToken: string | null;
  siteUrl: string;
};

/**
 * Tombol di kolom Aksi pengajar: membuat/menyalin link pribadi agar guru ini bisa memperbarui data dirinya sendiri.
 * Link tampil di jendela ini; admin bisa menyalin, mengirim via WhatsApp, membuat ulang, atau menonaktifkannya.
 */
export function TeacherUpdateLinkDialog({ id, name, initialToken, siteUrl }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [token, setToken] = useState(initialToken);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const url = useLinkUrl(token ? `/profil-guru/${token}` : "", siteUrl);

  // "Ustadzah Hana Salsabila" → "Ustadzah Hana"
  const [honorific, first] = name.split(" ");
  const callName = first ? `${honorific} ${first}` : name;
  const message = `Assalamu'alaikum ${callName}, mohon perbarui data diri Anda untuk website Partner Belajar lewat link pribadi berikut:\n\n${url}\n\nPerubahan langsung tampil di website. Link ini khusus untuk Anda, mohon tidak dibagikan ke orang lain. Jazakumullahu khairan.`;

  function run(task: () => Promise<EditLinkResult>, success: string) {
    startTransition(async () => {
      const result = await task();
      if ("error" in result) {
        toast(result.error, "error");
        return;
      }
      setToken(result.token);
      toast(success);
    });
  }

  async function copy() {
    if (!(await copyText(url))) {
      toast("Gagal menyalin. Salin manual dari kolom link.", "error");
      return;
    }
    setCopied(true);
    toast("Link tersalin. Tinggal tempel dan kirim ke pengajar.");
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-haspopup="dialog"
        aria-label={`Link update data diri ${name}`}
        title={token ? "Link update data diri (sudah dibuat)" : "Buat link update data diri"}
        className={`relative grid size-9 place-items-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40 ${
          token
            ? "bg-brand-teal-soft text-brand-teal-dark hover:bg-brand-teal-strong hover:text-white"
            : "bg-[var(--adm-hover)] text-ink hover:bg-brand-teal-soft hover:text-brand-teal-dark"
        }`}
      >
        <UserPen aria-hidden className="size-4" />
      </button>

      <dialog
        ref={ref}
        aria-labelledby={`edit-link-title-${id}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) ref.current?.close();
        }}
        className="m-auto w-[min(92vw,32rem)] rounded-2xl border border-line bg-surface p-0 text-ink shadow-lift backdrop:bg-black/45"
      >
        <div className="grid gap-4 p-5 md:p-6">
          <div>
            <h2 id={`edit-link-title-${id}`} className="text-base font-semibold text-ink">
              Link update data diri
            </h2>
            <p className="mt-0.5 text-[13px] text-ink-soft">{name}</p>
          </div>
          <p className="text-[13px] leading-relaxed text-ink-soft">
            Link pribadi ini hanya untuk pengajar tersebut: formnya sudah terisi data saat ini dan perubahan yang disimpan
            <strong className="font-semibold text-ink"> langsung tampil di situs</strong>. Kirim lewat WhatsApp, dan minta agar tidak dibagikan.
          </p>

          {token ? (
            <>
              <div className="flex min-w-0 items-center gap-2">
                <input
                  readOnly
                  value={url}
                  aria-label={`Link update data diri ${name}`}
                  onFocus={(event) => event.currentTarget.select()}
                  className="h-10 min-w-0 flex-1 truncate rounded-lg border border-line bg-[var(--adm-hover)]/60 px-3 font-mono text-xs text-ink-soft focus:border-brand-teal focus:outline-none"
                />
                <button
                  type="button"
                  onClick={copy}
                  className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold transition-all ${
                    copied ? "bg-emerald-500 text-white" : "bg-brand-teal-strong text-white hover:brightness-110"
                  }`}
                >
                  {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
                  {copied ? "Tersalin" : "Salin"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#e7f8ee] px-3.5 text-[13px] font-semibold text-[#178a43] transition-colors hover:bg-[#d3f1e0] dark:bg-[#10281b] dark:text-[#4ade80]"
                >
                  <WhatsAppIcon className="size-[18px]" />
                  Kirim lewat WhatsApp
                </a>
                <a href={`/profil-guru/${token}`} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
                  <ExternalLink aria-hidden className="size-4" />
                  Buka halaman
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (window.confirm("Buat ulang link? Link yang sudah dikirim ke pengajar ini langsung berhenti berlaku.")) {
                        run(() => createTeacherEditLinkAction(id, true), "Link baru dibuat. Link lama tidak berlaku lagi.");
                      }
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink disabled:opacity-50"
                  >
                    {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <RefreshCw aria-hidden className="size-4" />}
                    Buat ulang
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (window.confirm("Nonaktifkan link? Halamannya langsung tidak bisa dibuka lagi.")) {
                        run(() => removeTeacherEditLinkAction(id), "Link dinonaktifkan.");
                      }
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/40"
                  >
                    <Link2Off aria-hidden className="size-4" />
                    Nonaktifkan
                  </button>
                </div>
                <button type="button" onClick={() => ref.current?.close()} className={buttonSecondary}>
                  Tutup
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap justify-end gap-2 border-t border-line pt-4">
              <button type="button" onClick={() => ref.current?.close()} className={buttonSecondary}>
                Batal
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => createTeacherEditLinkAction(id), "Link pribadi dibuat. Salin lalu kirim ke pengajar.")}
                className={buttonPrimary}
              >
                {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
                {pending ? "Membuat…" : "Buat link pribadi"}
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
