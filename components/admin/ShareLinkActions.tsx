"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Check, Copy, ExternalLink, Loader2, Power, PowerOff, Trash2 } from "lucide-react";
import { copyText } from "@/lib/clipboard";
import { toast } from "./Toaster";

const subscribe = () => () => {};

/** Alamat link lengkap. Render awal memakai `siteUrl` dari server, lalu domain yang sedang dibuka. */
function useLinkUrl(path: string, siteUrl: string) {
  const origin = useSyncExternalStore(subscribe, () => window.location.origin, () => siteUrl);
  return `${origin}${path}`;
}

/** Gambar logo WhatsApp (lucide tidak menyediakan merek). */
function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.95L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3.1.9.9-3-.2-.3a8.1 8.1 0 1 1 6.8 3.7Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.3-3.3-2.9-.2-.3.2-.3.7-1.1.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 1.9 3 4.7 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

/** Kolom "Link": alamat lengkap + tombol salin. */
export function LinkCopyCell({ path, siteUrl, active }: { path: string; siteUrl: string; active: boolean }) {
  const url = useLinkUrl(path, siteUrl);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const ok = await copyText(url);
    if (!ok) {
      toast("Gagal menyalin. Salin manual dari kolom link.", "error");
      return;
    }
    setCopied(true);
    toast("Link testimoni tersalin. Tinggal tempel dan bagikan.");
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <input
        readOnly
        value={url}
        aria-label="Link testimoni"
        onFocus={(event) => event.currentTarget.select()}
        className={`h-9 min-w-0 flex-1 truncate rounded-lg border border-line bg-[var(--adm-hover)]/60 px-2.5 font-mono text-xs text-ink-soft focus:border-brand-teal focus:outline-none ${active ? "" : "line-through opacity-60"}`}
      />
      <button
        type="button"
        onClick={copy}
        className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold transition-all ${
          copied ? "bg-emerald-500 text-white" : "bg-brand-teal-strong text-white hover:brightness-110"
        }`}
      >
        {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
        {copied ? "Tersalin" : "Salin"}
      </button>
    </div>
  );
}

const iconBtn =
  "grid size-9 place-items-center rounded-lg bg-[var(--adm-hover)] text-ink transition-colors hover:bg-brand-teal-soft hover:text-brand-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40";

function Pending({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <>{children}</>;
}

type ServerAction = (formData: FormData) => void | Promise<void>;

/** Aksi per link: kirim via WhatsApp, buka halaman, aktif/nonaktif, hapus (+ tombol tambahan lewat children). */
export function ShareLinkActions({
  id,
  label,
  path,
  siteUrl,
  active,
  toggleAction,
  deleteAction,
  shareText,
  deleteMessage,
  children,
}: {
  id: string;
  label: string;
  path: string;
  siteUrl: string;
  active: boolean;
  toggleAction: ServerAction;
  deleteAction: ServerAction;
  /** Isi pesan WhatsApp. Tulis {url} di tempat link harus disisipkan. */
  shareText: string;
  deleteMessage: string;
  /** Tombol tambahan, tampil paling kiri (mis. atur PIN). */
  children?: ReactNode;
}) {
  const url = useLinkUrl(path, siteUrl);
  const message = shareText.split("{url}").join(url);

  return (
    <div className="flex items-center gap-1.5">
      {children}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Bagikan link ${label} lewat WhatsApp`}
        title="Bagikan lewat WhatsApp"
        className="grid size-9 place-items-center rounded-lg bg-[#e7f8ee] text-[#178a43] transition-colors hover:bg-[#d3f1e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1faf55]/40 dark:bg-[#10281b] dark:text-[#4ade80]"
      >
        <WhatsAppIcon className="size-[18px]" />
      </a>
      <a href={path} target="_blank" rel="noopener noreferrer" aria-label={`Buka halaman ${label}`} title="Buka halaman" className={iconBtn}>
        <ExternalLink aria-hidden className="size-4" />
      </a>
      <form action={toggleAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="active" value={active ? "" : "on"} />
        <button
          type="submit"
          aria-label={active ? `Nonaktifkan link ${label}` : `Aktifkan link ${label}`}
          title={active ? "Nonaktifkan link" : "Aktifkan link"}
          className={iconBtn}
        >
          <Pending>{active ? <Power aria-hidden className="size-4" /> : <PowerOff aria-hidden className="size-4" />}</Pending>
        </button>
      </form>
      <form
        action={deleteAction}
        onSubmit={(event) => {
          if (!window.confirm(deleteMessage)) event.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          aria-label={`Hapus link ${label}`}
          title="Hapus link"
          className="grid size-9 place-items-center rounded-lg bg-red-50 text-red-500 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 dark:bg-red-950/40 dark:hover:bg-red-950/70"
        >
          <Pending>
            <Trash2 aria-hidden className="size-4" />
          </Pending>
        </button>
      </form>
    </div>
  );
}
