"use client";

import { Search } from "lucide-react";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Kotak cari untuk daftar di halaman ini. Menyaring baris `[data-row]` di dalam `[data-list]`
 * berdasarkan atribut `data-search` (diisi lewat <ListRow search="…">) — tanpa memuat ulang halaman.
 */
export function ListSearch({ placeholder }: { placeholder: string }) {
  function filter(query: string) {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    document.querySelectorAll<HTMLElement>("[data-list]").forEach((list) => {
      let visible = 0;
      const rows = list.querySelectorAll<HTMLElement>("[data-row]");
      rows.forEach((row) => {
        const text = normalize(row.dataset.search ?? row.textContent ?? "");
        const match = terms.every((term) => text.includes(term));
        row.hidden = !match;
        if (match) visible++;
      });
      const count = list.querySelector<HTMLElement>("[data-list-count]");
      if (count) count.textContent = `${visible} data`;
      const empty = list.querySelector<HTMLElement>("[data-list-empty]");
      if (empty) empty.hidden = visible > 0 || rows.length === 0;
    });
  }

  return (
    <label className="relative block w-full sm:w-64">
      <span className="sr-only">{placeholder}</span>
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-soft" />
      <input
        type="search"
        placeholder={placeholder}
        onChange={(e) => filter(e.target.value)}
        className="h-10 w-full rounded-xl border border-line bg-surface pr-3 pl-10 text-sm text-ink shadow-soft placeholder:text-ink-soft/70 focus:border-brand-teal focus:ring-[3px] focus:ring-brand-teal/15 focus:outline-none"
      />
    </label>
  );
}
