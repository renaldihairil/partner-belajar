"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { FilterChips } from "@/components/ui/FilterChips";
import { pickFeaturedClass } from "@/lib/class-status";
import type { ProgramWithClasses, RegistrationStatus } from "@/types";
import { ProgramCard } from "./ProgramCard";

type Filter = "all" | "open" | "closed";

const filters: { id: Filter; label: string; match: (s: RegistrationStatus | null) => boolean }[] = [
  { id: "all", label: "Semua", match: () => true },
  { id: "open", label: "Pendaftaran dibuka", match: (s) => s === "open" },
  { id: "closed", label: "Penuh / ditutup", match: (s) => s === "full" || s === "closed" || s === null },
];

type ProgramExplorerProps = {
  programs: ProgramWithClasses[];
};

export function ProgramExplorer({ programs }: ProgramExplorerProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const entries = useMemo(
    () => programs.map((program) => ({ program, status: pickFeaturedClass(program.classes)?.status ?? null })),
    [programs],
  );

  const active = filters.find((f) => f.id === filter)!;
  const visible = entries.filter((entry) => active.match(entry.status));

  return (
    <>
      <FilterChips
        label="Saring program berdasarkan status pendaftaran"
        options={filters.map((f) => ({ id: f.id, label: f.label, count: entries.filter((entry) => f.match(entry.status)).length }))}
        value={filter}
        onChange={(id) => setFilter(id as Filter)}
      />

      <p aria-live="polite" className="sr-only">
        Menampilkan {visible.length} program
      </p>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-[var(--radius-card)] bg-background px-6 py-12 text-center">
          <SearchX aria-hidden className="size-10 text-muted" />
          <p className="mt-3 font-semibold text-ink">Belum ada program dengan status ini</p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="mt-3 min-h-11 rounded-full px-4 text-sm font-semibold text-brand-teal-dark underline-offset-4 hover:underline"
          >
            Tampilkan semua program
          </button>
        </div>
      ) : (
        // Subgrid (lg): kartu sebaris berbagi tinggi baris "visual" & "panel info" → panel putih sejajar.
        <div className="grid gap-5 lg:grid-cols-2">
          {visible.map(({ program }, index) => (
            <div
              key={program.id}
              className="animate-rise h-full lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <ProgramCard program={program} priority={index < 2} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
