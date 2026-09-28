"use client";

import { useState } from "react";
import { FilterChips } from "@/components/ui/FilterChips";
import { Reveal } from "@/components/ui/Reveal";
import type { Program, Testimonial } from "@/types";
import { TestimonialCard } from "./TestimonialCard";

export function TestimonialsExplorer({ items, programs }: { items: Testimonial[]; programs: Program[] }) {
  const [filter, setFilter] = useState("all");
  const options = [
    { id: "all", label: "Semua", count: items.length },
    ...programs
      .map((p) => ({ id: p.id, label: p.title, count: items.filter((t) => t.programId === p.id).length }))
      .filter((o) => o.count > 0),
  ];
  const visible = filter === "all" ? items : items.filter((t) => t.programId === filter);

  return (
    <>
      <FilterChips label="Saring testimoni berdasarkan program" options={options} value={filter} onChange={setFilter} />
      <p aria-live="polite" className="sr-only">
        Menampilkan {visible.length} testimoni
      </p>
      <ul className="columns-1 gap-4 md:columns-2 xl:columns-3 [&>li]:mb-4">
        {visible.map((item, index) => (
          <Reveal as="li" key={item.id} delay={(index % 3) * 70} className="break-inside-avoid">
            <TestimonialCard {...item} className="w-full" />
          </Reveal>
        ))}
      </ul>
    </>
  );
}
