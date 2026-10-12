"use client";

import { useId, useState } from "react";
import { Plus, X } from "lucide-react";

/**
 * Daftar keunggulan untuk form publik guru: satu kolom per keunggulan, bisa ditambah tanpa batas.
 * Terkirim sebagai `${name}_json` (daftar teks); kolom kosong diabaikan server.
 */
export function HighlightsInput({ name, defaultValue = [], className }: { name: string; defaultValue?: string[]; className: string }) {
  const uid = useId();
  const [items, setItems] = useState<string[]>(defaultValue.length > 0 ? defaultValue : [""]);

  return (
    <div>
      <input type="hidden" name={`${name}_json`} value={JSON.stringify(items.map((s) => s.trim()).filter(Boolean))} />
      <ul className="grid gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <input
              id={`${uid}-${index}`}
              value={item}
              onChange={(event) => setItems((prev) => prev.map((v, i) => (i === index ? event.target.value : v)))}
              placeholder={index === 0 ? "mis. Metode talaqqi" : "Keunggulan lainnya"}
              aria-label={`Keunggulan ${index + 1}`}
              className={`${className} !mt-0`}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                aria-label={`Hapus keunggulan ${index + 1}`}
                className="grid size-11 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setItems((prev) => [...prev, ""])}
        className="mt-2.5 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-dashed border-brand-teal/50 px-4 text-sm font-semibold text-brand-teal-dark transition-colors hover:bg-brand-teal-soft"
      >
        <Plus aria-hidden className="size-4" />
        Tambah keunggulan
      </button>
    </div>
  );
}
