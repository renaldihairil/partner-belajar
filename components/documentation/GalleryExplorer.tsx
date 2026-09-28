"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { FilterChips } from "@/components/ui/FilterChips";
import { Reveal } from "@/components/ui/Reveal";
import { formatDateId, formatDateLongId } from "@/lib/format";
import type { DocumentationCategory, DocumentationItem, Program } from "@/types";

const categories: DocumentationCategory[] = ["Kelas Online", "Tatap Muka", "Kegiatan Spesial"];

type GalleryExplorerProps = {
  items: DocumentationItem[];
  programs: Program[];
};

export function GalleryExplorer({ items, programs }: GalleryExplorerProps) {
  const [filter, setFilter] = useState("all");
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const visible = filter === "all" ? items : items.filter((item) => item.category === filter);
  const current = index !== null ? visible[index] : null;
  const program = current?.programId ? programs.find((p) => p.id === current.programId) : undefined;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  const options = [
    { id: "all", label: "Semua", count: items.length },
    ...categories.map((c) => ({ id: c, label: c, count: items.filter((i) => i.category === c).length })),
  ];

  return (
    <>
      <FilterChips
        label="Saring dokumentasi berdasarkan kategori"
        options={options}
        value={filter}
        onChange={(id) => {
          setFilter(id);
          setIndex(null);
        }}
      />
      <p aria-live="polite" className="sr-only">
        Menampilkan {visible.length} dokumentasi
      </p>

      {/* Masonry sederhana dengan CSS columns */}
      <ul className="columns-1 gap-4 sm:columns-2 xl:columns-3 [&>li]:mb-4">
        {visible.map((item, i) => (
          <Reveal as="li" key={item.id} delay={(i % 3) * 70} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-haspopup="dialog"
              className="gallery-card group relative block w-full overflow-clip rounded-[24px] text-left shadow-soft ring-1 ring-line"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={item.width}
                height={item.height}
                sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
                className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute top-3 left-3 rounded-full bg-panel px-2.5 py-1 text-[11.5px] font-semibold text-ink backdrop-blur">
                {item.category}
              </span>
              <span
                aria-hidden
                className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-panel text-ink opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <Expand className="size-4" />
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent p-4 pt-12 text-white">
                <span className="block text-[15px] leading-snug font-bold">{item.title}</span>
                <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-white/85">
                  <CalendarDays aria-hidden className="size-3.5" />
                  {formatDateId(item.date)}
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      {/* Lightbox */}
      <dialog
        ref={dialogRef}
        aria-label={current ? `Dokumentasi: ${current.title}` : "Dokumentasi"}
        className="lightbox"
        onClose={() => setIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {current && (
          <div
            className="flex h-full flex-col items-center justify-center gap-4 p-4 md:p-8"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <div className="flex w-full max-w-5xl items-center justify-between text-white">
              <span className="text-sm font-medium text-white/80">
                {index! + 1} / {visible.length}
              </span>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Tutup"
                className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <X aria-hidden className="size-6" />
              </button>
            </div>

            <div className="relative flex w-full max-w-5xl flex-1 items-center justify-center">
              <Image
                key={current.id}
                src={current.image}
                alt={current.title}
                width={current.width}
                height={current.height}
                sizes="(min-width: 1024px) 70vw, 95vw"
                className="lightbox-image max-h-[62dvh] w-auto rounded-[20px] object-contain md:max-h-[68dvh]"
              />
              {visible.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Sebelumnya"
                    className="absolute left-0 grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 md:-left-4"
                  >
                    <ChevronLeft aria-hidden className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Berikutnya"
                    className="absolute right-0 grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 md:-right-4"
                  >
                    <ChevronRight aria-hidden className="size-6" />
                  </button>
                </>
              )}
            </div>

            <div className="w-full max-w-3xl text-center text-white">
              <p className="text-lg font-bold">{current.title}</p>
              <p className="mt-1 text-sm text-white/80">{current.caption}</p>
              <p className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-white/70">
                <span>{formatDateLongId(current.date)}</span>
                <span aria-hidden>·</span>
                <span>{current.category}</span>
                {program && (
                  <>
                    <span aria-hidden>·</span>
                    <Link href={`/program/${program.slug}`} className="font-semibold text-brand-yellow underline-offset-4 hover:underline">
                      {program.title}
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
