import type { CSSProperties } from "react";
import { Star } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import type { Testimonial } from "@/types";

/** Ringkasan rating dihitung langsung dari data testimoni (bukan angka tetap). */
export function RatingSummary({ items }: { items: Testimonial[] }) {
  const total = items.length;
  const average = total ? items.reduce((sum, t) => sum + t.rating, 0) / total : 0;
  const rounded = Math.round(average * 10) / 10;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: items.filter((t) => t.rating === star).length,
  }));
  const recommend = total ? Math.round((items.filter((t) => t.rating >= 4).length / total) * 100) : 0;

  return (
    <section
      aria-label="Ringkasan rating"
      className="mb-8 grid gap-5 rounded-[28px] border border-line bg-surface p-5 shadow-soft md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-7"
    >
      <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-1">
        <p className="text-5xl leading-none font-extrabold text-ink md:text-6xl">
          <CountUp value={rounded} decimals={1} duration={1400} />
        </p>
        <div>
          <div className="flex gap-0.5" role="img" aria-label={`Rata-rata ${rounded} dari 5 bintang`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                aria-hidden
                className={`size-5 ${i < Math.round(average) ? "text-brand-yellow" : "text-line"}`}
                fill="currentColor"
                strokeWidth={0}
              />
            ))}
          </div>
          <p className="mt-1 text-sm text-ink-soft">dari {total} ulasan orang tua</p>
        </div>
      </div>

      <ul className="flex flex-col gap-1.5">
        {distribution.map(({ star, count }) => (
          <li key={star} className="flex items-center gap-3 text-sm">
            <span className="flex w-9 items-center gap-1 font-semibold text-ink">
              {star}
              <Star aria-hidden className="size-3.5 text-brand-yellow" fill="currentColor" strokeWidth={0} />
            </span>
            <span className="stat-bar h-2 flex-1 overflow-hidden rounded-full bg-background ring-1 ring-line">
              <span
                style={{ "--fill": `${total ? Math.round((count / total) * 100) : 0}%` } as CSSProperties}
                className="!bg-[linear-gradient(90deg,var(--brand-yellow),var(--brand-yellow-dark))]"
              />
            </span>
            <span className="w-6 text-right text-ink-soft">{count}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-[22px] bg-brand-teal-soft px-5 py-4 text-center">
        <p className="text-3xl font-extrabold text-brand-teal-dark">
          <CountUp value={recommend} suffix="%" duration={1400} />
        </p>
        <p className="mt-0.5 text-[13px] leading-snug text-ink">
          orang tua memberi
          <br />
          rating 4–5 bintang
        </p>
      </div>
    </section>
  );
}
