"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Search, SearchX, X } from "lucide-react";
import { FilterChips } from "@/components/ui/FilterChips";
import { Reveal } from "@/components/ui/Reveal";

export type ExplorerItem = {
  id: string;
  category: string;
  /** Teks gabungan (judul, ringkasan, tag, penulis) untuk pencarian. */
  searchText: string;
  /** Kartu yang sudah dirender di server. */
  card: ReactNode;
};

type ArticleExplorerProps = {
  items: ExplorerItem[];
  categories: string[];
  /** Artikel pilihan (dirender server); tampil saat tidak ada filter/pencarian. */
  featured?: { id: string; node: ReactNode };
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");

export function ArticleExplorer({ items, categories, featured }: ArticleExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const ready = useRef(false);

  // Baca ?q= & ?kategori= dari URL (mis. dari kotak pencarian di header).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") ?? "";
    const c = params.get("kategori") ?? "all";
    if (q) setQuery(q);
    if (categories.includes(c)) setCategory(c);
    ready.current = true;
  }, [categories]);

  // Simpan filter ke URL agar hasil pencarian bisa dibagikan / tetap saat kembali.
  useEffect(() => {
    if (!ready.current) return;
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    if (category !== "all") url.searchParams.set("kategori", category);
    else url.searchParams.delete("kategori");
    window.history.replaceState(window.history.state, "", url);
  }, [query, category]);

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const filtering = terms.length > 0 || category !== "all";
  const visible = items.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      terms.every((term) => normalize(item.searchText).includes(term)),
  );
  const grid = filtering || !featured ? visible : visible.filter((item) => item.id !== featured.id);

  const options = [
    { id: "all", label: "Semua", count: items.length },
    ...categories.map((c) => ({ id: c, label: c, count: items.filter((i) => i.category === c).length })),
  ];

  const reset = () => {
    setQuery("");
    setCategory("all");
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="w-full md:max-w-md">
          <label className="relative block">
            <span className="sr-only">Cari artikel</span>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-ink-soft" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul, topik, atau penulis…"
              className="h-12 w-full rounded-full border border-line bg-surface pr-12 pl-11 text-[15px] text-ink shadow-soft placeholder:text-ink-soft/80 transition-colors focus:border-brand-teal/50 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Hapus pencarian"
                className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-soft transition-colors hover:bg-background hover:text-ink"
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </label>
        </form>
        <p aria-live="polite" className="text-sm text-ink-soft">
          {filtering ? (
            <>
              <span className="font-semibold text-ink">{visible.length}</span> artikel ditemukan
            </>
          ) : (
            <>
              <span className="font-semibold text-ink">{items.length}</span> artikel untuk menemani belajar anak
            </>
          )}
        </p>
      </div>

      <FilterChips label="Saring artikel berdasarkan kategori" options={options} value={category} onChange={setCategory} />

      {!filtering && featured && <Reveal className="mb-10">{featured.node}</Reveal>}

      {!filtering && featured && grid.length > 0 && (
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold text-ink md:text-2xl">Artikel terbaru</h2>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-[28px] border border-dashed border-line bg-surface px-6 py-12 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-brand-yellow-soft text-warn">
            <SearchX aria-hidden className="size-8" />
          </span>
          <p className="mt-4 text-lg font-bold text-ink">Artikel tidak ditemukan</p>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">
            {query ? <>Belum ada artikel untuk “{query}”. </> : null}
            Coba kata kunci lain atau lihat semua artikel.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center rounded-full bg-brand-teal-strong px-5 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              Lihat semua artikel
            </button>
            <Link
              href="/program"
              className="inline-flex min-h-11 items-center rounded-full bg-background px-5 text-sm font-semibold text-ink ring-1 ring-line transition-colors hover:ring-brand-teal/40"
            >
              Jelajahi program
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {grid.map((item, index) => (
            <Reveal as="li" key={item.id} delay={(index % 3) * 80} className="article-item">
              {item.card}
            </Reveal>
          ))}
        </ul>
      )}
    </>
  );
}
