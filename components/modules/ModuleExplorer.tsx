"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { FilterChips } from "@/components/ui/FilterChips";
import { Reveal } from "@/components/ui/Reveal";
import type { LearningModule, Program } from "@/types";
import { ModuleCard } from "./ModuleCard";

/** Grid modul 3 kolom (desktop) dengan pencarian nama kitab dan saringan program. */
export function ModuleExplorer({ modules, programs }: { modules: LearningModule[]; programs: Program[] }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  // Chip program hanya untuk program yang punya modul.
  const usedPrograms = programs.filter((p) => modules.some((m) => m.programId === p.id));
  const options = [
    { id: "all", label: "Semua", count: modules.length },
    ...usedPrograms.map((p) => ({ id: p.id, label: p.title, count: modules.filter((m) => m.programId === p.id).length })),
  ];

  const needle = query.trim().toLowerCase();
  const visible = modules.filter(
    (m) =>
      (filter === "all" || m.programId === filter) &&
      (!needle || `${m.title} ${m.description}`.toLowerCase().includes(needle)),
  );

  return (
    <>
      {modules.length > 3 && (
        <label className="relative mb-4 block max-w-md">
          <span className="sr-only">Cari modul belajar</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama kitab..."
            className="h-11 w-full rounded-full border border-line bg-surface pr-4 pl-11 text-sm text-ink placeholder:text-ink-soft/80 transition-colors focus:border-brand-teal/40 focus:outline-none"
          />
        </label>
      )}
      {usedPrograms.length > 0 && (
        <FilterChips label="Saring modul berdasarkan program" options={options} value={filter} onChange={setFilter} />
      )}
      <p aria-live="polite" className="sr-only">
        Menampilkan {visible.length} modul belajar
      </p>

      {visible.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-background p-6 text-ink-soft">
          Tidak ada modul yang cocok. Coba kata kunci atau program lain.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {visible.map((item, index) => (
            <Reveal as="li" key={item.id} delay={(index % 4) * 70} className="h-full">
              <ModuleCard module={item} program={programs.find((p) => p.id === item.programId)} priority={index < 3} />
            </Reveal>
          ))}
        </ul>
      )}
    </>
  );
}
