import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/types";

type MarqueeRowProps = {
  items: Testimonial[];
  reverse?: boolean;
  /** Baris dekoratif tambahan disembunyikan dari pembaca layar agar konten tidak terbaca dua kali. */
  decorative?: boolean;
  className?: string;
};

function MarqueeRow({ items, reverse = false, decorative = false, className = "" }: MarqueeRowProps) {
  const style = { "--marquee-duration": `${items.length * 9}s` } as CSSProperties;
  return (
    <div className={`marquee py-3 ${className}`} aria-hidden={decorative || undefined}>
      <div className="marquee-track" data-direction={reverse ? "reverse" : undefined} style={style}>
        {/* Dua salinan identik → translateX(-50%) menghasilkan loop tanpa putus. */}
        {[false, true].map((clone) => (
          <ul
            key={String(clone)}
            aria-hidden={clone || undefined}
            className={`flex shrink-0 gap-4 pr-4 md:gap-5 md:pr-5 ${clone ? "marquee-clone" : ""}`}
          >
            {items.map((item) => (
              <li key={item.id} className="flex">
                <TestimonialCard {...item} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  const secondRow = [...items.slice(Math.ceil(items.length / 2)), ...items.slice(0, Math.ceil(items.length / 2))];

  return (
    <section aria-labelledby="testimoni-title" className="testimonials relative mt-14 md:mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          id="testimoni-title"
          eyebrow="Testimoni"
          title="Apa Kata Orang Tua"
          description="Cerita dari keluarga yang telah belajar bersama Partner Belajar."
        />
        {/* Kontrol jeda tanpa JavaScript (WCAG 2.2.2 — konten bergerak bisa dihentikan). */}
        <label className="marquee-toggle-label inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink-soft transition-colors hover:border-brand-teal/40 hover:text-ink has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-yellow-dark">
          <input type="checkbox" className="marquee-toggle sr-only" />
          <Pause aria-hidden className="icon-pause size-4" />
          <Play aria-hidden className="icon-play size-4" />
          <span className="label-pause">Jeda</span>
          <span className="label-play">Putar</span>
          <span className="sr-only"> animasi testimoni</span>
        </label>
      </div>

      <div className="-mx-5 mt-6 md:mx-0">
        <MarqueeRow items={items} />
        <MarqueeRow items={secondRow} reverse decorative className="hidden lg:block" />
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/testimoni"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-brand-teal-dark ring-1 ring-brand-teal/30 transition-colors hover:bg-brand-teal-soft"
        >
          Lihat semua testimoni
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
