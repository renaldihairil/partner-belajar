"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, Link2, Mail, MessageCircle, Send, Share2 } from "lucide-react";

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.5 21.5v-7.8h2.6l.4-3.1h-3V8.7c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H7.9v3.1h2.6v7.8h3Z" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.3L5.4 21H2.3l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.5l11.2 14.5Z" />
    </svg>
  );
}

type Target = { id: string; label: string; icon: ReactNode; href: string; tone: string };

function shareTargets(url: string, title: string): Target[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <MessageCircle className="size-[18px]" />,
      href: `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${url}`)}`,
      tone: "bg-[#1faf55] text-white",
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: <FacebookIcon className="size-[18px]" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      tone: "bg-[#1877f2] text-white",
    },
    {
      id: "x",
      label: "X (Twitter)",
      icon: <XIcon className="size-4" />,
      href: `https://x.com/intent/tweet?text=${t}&url=${u}`,
      tone: "bg-[#111] text-white dark:bg-white dark:text-[#111]",
    },
    {
      id: "telegram",
      label: "Telegram",
      icon: <Send className="size-4" />,
      href: `https://t.me/share/url?url=${u}&text=${t}`,
      tone: "bg-[#27a0dc] text-white",
    },
    {
      id: "email",
      label: "Email",
      icon: <Mail className="size-4" />,
      href: `mailto:?subject=${t}&body=${encodeURIComponent(`${title}\n\n${url}`)}`,
      tone: "bg-brand-yellow text-on-accent",
    },
  ];
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Cadangan untuk browser lama / konteks non-HTTPS.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/**
 * URL absolut artikel. Render awal memakai `siteUrl` dari server (sama di SSR & hidrasi),
 * lalu diganti origin browser agar link selalu cocok dengan domain yang sedang dibuka.
 */
function useShareUrl(path: string, siteUrl: string) {
  const [origin, setOrigin] = useState(siteUrl);
  useEffect(() => setOrigin(window.location.origin), []);
  return `${origin}${path}`;
}

function useCopy(url: string) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);
  return {
    copied,
    copy: async () => {
      const ok = await copyText(url);
      // Clipboard diblokir browser → tampilkan link agar bisa disalin manual.
      if (!ok) window.prompt("Salin link artikel ini:", url);
      setCopied(ok);
    },
  };
}

type ShareProps = {
  /** Path artikel, mis. "/artikel/slug". */
  path: string;
  title: string;
  /** URL situs dari server (siteConfig.url). */
  siteUrl: string;
  className?: string;
};

/**
 * Tombol ikon "Bagikan" untuk kartu artikel.
 * HP (layar sentuh) → lembar bagikan bawaan perangkat; desktop → menu salin link & media sosial.
 */
export function ShareMenu({ path, title, siteUrl, className = "" }: ShareProps) {
  const url = useShareUrl(path, siteUrl);
  const { copied, copy } = useCopy(url);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    rootRef.current?.querySelector<HTMLElement>("[data-share-item]")?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onTrigger = async () => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // Pengguna membatalkan → selesai; error lain → tampilkan menu cadangan.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    setOpen((v) => !v);
  };

  return (
    <div ref={rootRef} data-open={open || undefined} className={`share-menu relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={onTrigger}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Bagikan artikel: ${title}`}
        title="Bagikan"
        className={`grid size-10 place-items-center rounded-full transition-all duration-200 ${
          open
            ? "bg-brand-teal-strong text-white"
            : "bg-background text-ink-soft ring-1 ring-line hover:bg-brand-teal-soft hover:text-brand-teal-dark hover:ring-brand-teal/30"
        }`}
      >
        <Share2 aria-hidden className="size-[18px]" />
      </button>

      {open && (
        <div
          id={menuId}
          className="share-popover absolute right-0 bottom-full z-30 mb-2 w-60 rounded-[20px] border border-line bg-surface p-2 shadow-lift"
        >
          <p className="px-2.5 pt-1.5 pb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">Bagikan artikel</p>
          <button
            type="button"
            data-share-item
            onClick={copy}
            className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-ink transition-colors hover:bg-background focus-visible:bg-background"
          >
            <span
              className={`grid size-8 place-items-center rounded-full transition-colors ${
                copied ? "bg-brand-teal-strong text-white" : "bg-brand-teal-soft text-brand-teal-dark"
              }`}
            >
              {copied ? <Check aria-hidden className="size-4" /> : <Link2 aria-hidden className="size-4" />}
            </span>
            {copied ? "Link tersalin!" : "Salin link"}
          </button>
          <div className="my-1.5 h-px bg-line" />
          <ul>
            {shareTargets(url, title).map((target) => (
              <li key={target.id}>
                <a
                  data-share-item
                  href={target.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-background focus-visible:bg-background"
                >
                  <span aria-hidden className={`grid size-8 place-items-center rounded-full ${target.tone}`}>
                    {target.icon}
                  </span>
                  {target.label}
                </a>
              </li>
            ))}
          </ul>
          <p aria-live="polite" className="sr-only">
            {copied ? "Link artikel tersalin" : ""}
          </p>
        </div>
      )}
    </div>
  );
}

/** Deretan tombol bagikan untuk halaman detail artikel. */
export function ShareBar({ path, title, siteUrl, className = "" }: ShareProps) {
  const url = useShareUrl(path, siteUrl);
  const { copied, copy } = useCopy(url);

  return (
    <div className={className}>
      <ul className="flex flex-wrap items-center gap-2">
        {shareTargets(url, title)
          .filter((target) => target.id !== "email")
          .map((target) => (
            <li key={target.id}>
              <a
                href={target.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Bagikan ke ${target.label}`}
                title={target.label}
                className={`grid size-10 place-items-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 ${target.tone}`}
              >
                {target.icon}
              </a>
            </li>
          ))}
        <li>
          <button
            type="button"
            onClick={copy}
            className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
              copied
                ? "bg-brand-teal-strong text-white"
                : "bg-brand-teal-soft text-brand-teal-dark hover:bg-brand-teal hover:text-white"
            }`}
          >
            {copied ? <Check aria-hidden className="size-4" /> : <Link2 aria-hidden className="size-4" />}
            {copied ? "Tersalin!" : "Salin link"}
          </button>
        </li>
      </ul>
      <p aria-live="polite" className="sr-only">
        {copied ? "Link artikel tersalin" : ""}
      </p>
    </div>
  );
}
