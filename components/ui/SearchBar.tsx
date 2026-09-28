import { Search } from "lucide-react";

/** Pencarian di header — membuka halaman Artikel dengan ?q= (disaring di sana). */

export function SearchBar({ className = "" }: { className?: string }) {
  return (
    <form role="search" action="/artikel" className={className}>
      <label className="relative block">
        <span className="sr-only">Cari artikel atau topik</span>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-soft" />
        <input
          type="search"
          name="q"
          placeholder="Cari artikel atau topik..."
          className="h-11 w-full rounded-full border border-transparent bg-background pr-4 pl-11 text-sm text-ink placeholder:text-ink-soft/80 transition-colors focus:border-brand-teal/40 focus:bg-surface focus:outline-none"
        />
      </label>
    </form>
  );
}
