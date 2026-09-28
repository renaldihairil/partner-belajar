import { MapPin, Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types";

const avatarTone: Record<Testimonial["tone"], string> = {
  teal: "bg-brand-teal-soft text-brand-teal-dark",
  yellow: "bg-brand-yellow-soft text-warn",
  blue: "bg-soft-blue text-brand-teal-dark",
  green: "bg-soft-green text-brand-teal-dark",
  purple: "bg-soft-purple text-accent-purple-ink",
};

function initials(name: string) {
  const words = name.replace(/^(Ibu|Bapak|Bpk\.?|Bu|Pak)\s+/i, "").split(/\s+/);
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Kartu testimoni — dipakai di marquee Home (lebar tetap) dan grid halaman Testimoni (lebar penuh). */
export function TestimonialCard({
  name,
  role,
  quote,
  rating,
  tone,
  city,
  className = "w-[290px] shrink-0 sm:w-[340px]",
}: Testimonial & { className?: string }) {
  return (
    <figure className={`relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-soft md:p-6 ${className}`}>
      <Quote aria-hidden className="absolute top-5 right-5 size-8 text-brand-teal-soft" fill="currentColor" />
      <div className="flex gap-0.5" role="img" aria-label={`Rating ${rating} dari 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            aria-hidden
            className={`size-4 ${i < rating ? "text-brand-yellow" : "text-line"}`}
            fill="currentColor"
            strokeWidth={0}
          />
        ))}
      </div>
      <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink">“{quote}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <span
          aria-hidden
          className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ${avatarTone[tone]}`}
        >
          {initials(name)}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block text-sm font-semibold text-ink">{name}</span>
          <span className="block truncate text-xs text-ink-soft">{role}</span>
          {city && (
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted">
              <MapPin aria-hidden className="size-3" />
              {city}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

