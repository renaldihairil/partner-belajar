"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { FilterChips } from "@/components/ui/FilterChips";
import type { Program, Teacher } from "@/types";
import { TeacherCard } from "./TeacherCard";

export function TeacherExplorer({ teachers, programs }: { teachers: Teacher[]; programs: Program[] }) {
  const [filter, setFilter] = useState("all");

  const options = [
    { id: "all", label: "Semua", count: teachers.length },
    ...programs.map((p) => ({
      id: p.id,
      label: p.title,
      count: teachers.filter((t) => t.programIds.includes(p.id)).length,
    })),
  ];
  const visible = filter === "all" ? teachers : teachers.filter((t) => t.programIds.includes(filter));

  return (
    <>
      <FilterChips label="Saring pengajar berdasarkan program" options={options} value={filter} onChange={setFilter} />
      <p aria-live="polite" className="sr-only">
        Menampilkan {visible.length} pengajar
      </p>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((teacher, index) => (
          <Reveal as="li" key={teacher.id} delay={(index % 3) * 80}>
            <TeacherCard teacher={teacher} programs={programs} />
          </Reveal>
        ))}
      </ul>
    </>
  );
}
