"use client";

import { ChevronRight, MapPin, Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types";
import { useOpenTestimonial } from "./TestimonialDetail";
import { avatarTone, initials } from "./testimonial-ui";

/** Kutipan lebih panjang dari ini dipotong di kartu (5 baris) dan lengkapnya ada di jendela detail. */
const LONG_QUOTE = 150;

/**
 * Kartu testimoni — dipakai di marquee Home (lebar tetap) dan grid halaman Testimoni (lebar penuh).
 * Tinggi seragam: kutipan dipotong, klik membuka jendela detail (butuh TestimonialDetailProvider).
 */
export function TestimonialCard({
  className = "w-[290px] shrink-0 sm:w-[340px]",
  ...item
}: Testimonial & { className?: string }) {
  const { name, role, quote, rating, tone, city } = item;
  const open = useOpenTestimonial();
  const isLong = quote.length > LONG_QUOTE;

  const body = (
    <>
      <Quote aria-hidden className="absolute top-5 right-5 size-8 text-brand-teal-soft" fill="currentColor" />
      <span className="flex gap-0.5" role="img" aria-label={`Rating ${rating} dari 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} aria-hidden className={`size-4 ${i < rating ? "text-brand-yellow" : "text-line"}`} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <span className="mt-3 line-clamp-5 block min-h-[7.5rem] text-[14.5px] leading-6 text-ink">“{quote}”</span>
      <span className="mt-1 flex h-6 items-center gap-0.5 text-[13px] font-semibold text-brand-teal-dark">
        {isLong && (
          <>
            Baca selengkapnya
            <ChevronRight aria-hidden className="size-4" />
          </>
        )}
      </span>
      <span className="mt-auto flex items-center gap-3 border-t border-line pt-4">
        <span aria-hidden className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ${avatarTone[tone]}`}>
          {initials(name)}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold text-ink">{name}</span>
          <span className="block truncate text-xs text-ink-soft">{role}</span>
          {city && (
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted">
              <MapPin aria-hidden className="size-3" />
              {city}
            </span>
          )}
        </span>
      </span>
    </>
  );

  const shell = `relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 text-left shadow-soft md:p-6 ${className}`;

  if (!open) return <div className={shell}>{body}</div>;

  return (
    <button
      type="button"
      onClick={() => open(item)}
      aria-haspopup="dialog"
      aria-label={`Baca testimoni lengkap dari ${name}`}
      className={`${shell} cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-teal`}
    >
      {body}
    </button>
  );
}
