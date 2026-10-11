"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { MapPin, Quote, Star } from "lucide-react";
import { DetailDialog } from "@/components/ui/DetailDialog";
import { formatDateLongId } from "@/lib/format";
import type { Testimonial } from "@/types";
import { avatarTone, initials } from "./testimonial-ui";

const OpenContext = createContext<((item: Testimonial) => void) | null>(null);

/** Membuka jendela detail testimoni; null bila tidak ada provider (kartu tetap tampil tanpa klik). */
export function useOpenTestimonial() {
  return useContext(OpenContext);
}

/** Satu jendela detail untuk semua kartu testimoni di bawahnya (grid halaman Testimoni & marquee Beranda). */
export function TestimonialDetailProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<Testimonial | null>(null);

  return (
    <OpenContext.Provider value={setItem}>
      {children}
      <DetailDialog open={item !== null} onClose={() => setItem(null)} label={item ? `Testimoni dari ${item.name}` : "Testimoni"}>
        {item && (
          <figure className="p-6 pt-8 md:p-8 md:pt-10">
            <Quote aria-hidden className="size-9 text-brand-teal-soft" fill="currentColor" />
            <div className="mt-3 flex gap-0.5" role="img" aria-label={`Rating ${item.rating} dari 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} aria-hidden className={`size-5 ${i < item.rating ? "text-brand-yellow" : "text-line"}`} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="mt-4 text-base leading-relaxed whitespace-pre-line text-ink">“{item.quote}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <span aria-hidden className={`grid size-12 shrink-0 place-items-center rounded-full text-base font-bold ${avatarTone[item.tone]}`}>
                {initials(item.name)}
              </span>
              <span className="min-w-0 leading-snug">
                <span className="block font-semibold text-ink">{item.name}</span>
                <span className="block text-sm text-ink-soft">{item.role}</span>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted">
                  {item.city && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin aria-hidden className="size-3" />
                      {item.city}
                    </span>
                  )}
                  {item.date && <span>{formatDateLongId(item.date)}</span>}
                </span>
              </span>
            </figcaption>
          </figure>
        )}
      </DetailDialog>
    </OpenContext.Provider>
  );
}
