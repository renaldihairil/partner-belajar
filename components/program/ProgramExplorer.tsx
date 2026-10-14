"use client";

import type { ProgramWithClasses } from "@/types";
import { ProgramCard } from "./ProgramCard";

/** Grid program: kartu ringkas dengan tombol Daftar Sekarang & Detail. */
export function ProgramExplorer({ programs }: { programs: ProgramWithClasses[] }) {
  if (programs.length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] bg-background p-6 text-ink-soft">Program belajar akan segera tersedia.</p>
    );
  }

  return (
    // Subgrid (lg): kartu sebaris berbagi tinggi baris "visual" & "panel tombol" → sejajar.
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {programs.map((program, index) => (
        <div
          key={program.id}
          className="animate-rise h-full lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <ProgramCard program={program} priority={index < 2} />
        </div>
      ))}
    </div>
  );
}
