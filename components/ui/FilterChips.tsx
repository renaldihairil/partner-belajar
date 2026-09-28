"use client";

export type FilterOption = { id: string; label: string; count?: number };

type FilterChipsProps = {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (id: string) => void;
};

/** Baris chip filter yang bisa digeser di mobile — dipakai di Program, Pengajar, Dokumentasi, Testimoni. */
export function FilterChips({ label, options, value, onChange }: FilterChipsProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-5 mb-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max gap-2">
        {options.map((option) => {
          const pressed = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => onChange(option.id)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition-all ${
                pressed
                  ? "bg-brand-teal-strong text-white shadow-[0_8px_18px_-10px_rgb(14_127_122/0.8)]"
                  : "bg-surface text-ink-soft ring-1 ring-line hover:text-ink hover:ring-brand-teal/40"
              }`}
            >
              {option.label}
              {option.count !== undefined && (
                <span
                  className={`grid min-w-5 place-items-center rounded-full px-1.5 text-[11px] ${
                    pressed ? "bg-white/20 text-white" : "bg-background text-ink-soft"
                  }`}
                >
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
