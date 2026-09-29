"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { FilterChips } from "@/components/ui/FilterChips";
import { Reveal } from "@/components/ui/Reveal";
import { formatDateId, formatDateLongId } from "@/lib/format";
import { youtubeEmbedUrl, youtubeThumbnail, youtubeWatchUrl } from "@/lib/youtube";
import type { DocumentationCategory, DocumentationItem, Program } from "@/types";

const categories: DocumentationCategory[] = ["Kelas Online", "Tatap Muka", "Kegiatan Spesial"];

type GalleryExplorerProps = {
  items: DocumentationItem[];
  programs: Program[];
};

/** Galeri video dokumentasi: grid 3 kolom berukuran sama (16:9); klik untuk menonton di jendela pemutar. */
export function GalleryExplorer({ items, programs }: GalleryExplorerProps) {
  const [filter, setFilter] = useState("all");
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

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
        Menampilkan {visible.length} video dokumentasi
      </p>

      {visible.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-background p-6 text-ink-soft">Belum ada video di kategori ini.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {visible.map((item, i) => (
            <Reveal as="li" key={item.id} delay={(i % 3) * 70}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-haspopup="dialog"
                aria-label={`Putar video: ${item.title}`}
                className="gallery-card group relative block aspect-video w-full overflow-clip rounded-[24px] bg-ink/10 text-left shadow-soft ring-1 ring-line"
              >
                <Image
                  src={youtubeThumbnail(item.youtubeId)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute top-3 left-3 rounded-full bg-panel px-2.5 py-1 text-[11.5px] font-semibold text-ink backdrop-blur">
                  {item.category}
                </span>
                <span
                  aria-hidden
                  className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-teal-dark shadow-lift transition-transform duration-300 group-hover:scale-110"
                >
                  <Play className="ml-0.5 size-6" fill="currentColor" />
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent p-4 pt-12 text-white">
                  <span className="line-clamp-2 block text-[15px] leading-snug font-bold">{item.title}</span>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-white/85">
                    <CalendarDays aria-hidden className="size-3.5" />
                    {formatDateId(item.date)}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      )}

      {/* Jendela pemutar video */}
      <dialog
        ref={dialogRef}
        aria-label={current ? `Video dokumentasi: ${current.title}` : "Video dokumentasi"}
        className="lightbox"
        onClose={() => setIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {current && (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-4 md:p-8">
            <div className="flex w-full max-w-4xl items-center justify-between text-white">
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

            <div className="relative flex w-full max-w-4xl items-center justify-center">
              <div className="aspect-video w-full overflow-clip rounded-[20px] bg-black shadow-lift">
                <iframe
                  key={current.id}
                  src={youtubeEmbedUrl(current.youtubeId, true)}
                  title={current.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="size-full border-0"
                />
              </div>
              {visible.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Video sebelumnya"
                    className="absolute left-2 grid size-12 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65 lg:-left-16 lg:bg-white/15 lg:hover:bg-white/25"
                  >
                    <ChevronLeft aria-hidden className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Video berikutnya"
                    className="absolute right-2 grid size-12 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65 lg:-right-16 lg:bg-white/15 lg:hover:bg-white/25"
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
                <span aria-hidden>·</span>
                <a href={youtubeWatchUrl(current.youtubeId)} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                  Buka di YouTube
                </a>
              </p>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
