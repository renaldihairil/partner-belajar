"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

type Toast = { id: number; message: string; tone: "success" | "error" };

// Penyimpanan toast sederhana (tanpa library) yang bisa dipanggil dari komponen mana pun.
let toasts: Toast[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(message: string, tone: Toast["tone"] = "success") {
  const id = Date.now() + Math.random();
  toasts = [...toasts, { id, message, tone }].slice(-3);
  emit();
  window.setTimeout(() => dismiss(id), 4000);
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const EMPTY: Toast[] = [];

export function Toaster() {
  const items = useSyncExternalStore(subscribe, () => toasts, () => EMPTY);
  return (
    <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-20 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className="adm-toast pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink shadow-lift"
        >
          {t.tone === "success" ? (
            <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-teal" />
          ) : (
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-red-500" />
          )}
          <p className="flex-1 font-medium">{t.message}</p>
          <button type="button" onClick={() => dismiss(t.id)} aria-label="Tutup notifikasi" className="-mr-1 grid size-6 place-items-center rounded-md text-ink-soft hover:bg-[var(--adm-hover)]">
            <X aria-hidden className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/** Menampilkan pesan dari query string (mis. ?pesan=tersimpan) sebagai toast, lalu membersihkan URL. */
export function NoticeToast({ message }: { message?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    if (!message || shown === message) return;
    toast(message);
    setShown(message);
    const next = new URLSearchParams(params.toString());
    next.delete("pesan");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [message, shown, params, pathname, router]);

  return null;
}
