"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Star } from "lucide-react";

const LABELS = ["", "Kurang puas", "Cukup", "Baik", "Puas", "Sangat puas"];

/**
 * Pilihan rating bintang yang bisa diklik atau dikendalikan keyboard (panah kiri/kanan).
 * Nilai terkirim lewat input tersembunyi bernama `name`.
 */
export function StarRatingInput({
  name,
  value,
  onChange,
  invalid,
  labelledBy,
}: {
  name: string;
  value: number;
  onChange: (value: number) => void;
  invalid?: boolean;
  labelledBy: string;
}) {
  const [hover, setHover] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = hover || value;

  function onKeyDown(event: KeyboardEvent, current: number) {
    const step = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = Math.min(5, Math.max(1, current + step));
    onChange(next);
    refs.current[next - 1]?.focus();
  }

  return (
    <div>
      <input type="hidden" name={name} value={value || ""} />
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-invalid={invalid}
        className="flex items-center gap-1"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const checked = value === n;
          return (
            <button
              key={n}
              ref={(el) => {
                refs.current[n - 1] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${n} bintang`}
              tabIndex={checked || (!value && n === 1) ? 0 : -1}
              onClick={() => onChange(n)}
              onMouseEnter={() => setHover(n)}
              onKeyDown={(event) => onKeyDown(event, n)}
              className="grid size-12 place-items-center rounded-2xl transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-teal/25 active:scale-95"
            >
              <Star
                aria-hidden
                className={`size-9 transition-colors duration-150 ${n <= shown ? "text-brand-yellow drop-shadow-[0_2px_4px_rgb(233_169_0/0.35)]" : "text-line"}`}
                fill="currentColor"
                strokeWidth={n <= shown ? 0 : 1.5}
              />
            </button>
          );
        })}
        <span aria-live="polite" className="ml-2 min-w-24 text-sm font-semibold text-brand-teal-dark">
          {LABELS[shown]}
        </span>
      </div>
    </div>
  );
}
