import { CheckCircle2, Clock3, GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProgramWithClasses } from "@/types";

export function CurriculumSection({ program }: { program: ProgramWithClasses }) {
  return (
    <section id="kurikulum" aria-labelledby="kurikulum-title" className="scroll-mt-24">
      <SectionHeading
        id="kurikulum-title"
        eyebrow="Kurikulum"
        title="Belajar bertahap, jelas arahnya"
        description="Setiap tahap punya target yang terukur, sehingga orang tua bisa memantau perkembangan anak."
      />

      <ol className="relative mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Garis penghubung antar tahap (desktop lebar) */}
        <span
          aria-hidden
          className="absolute top-[34px] right-[12%] left-[12%] hidden h-0.5 bg-[repeating-linear-gradient(90deg,var(--brand-teal)_0_8px,transparent_8px_16px)] opacity-30 xl:block"
        />
        {program.curriculum.map((module, index) => (
          <li
            key={module.id}
            className="animate-rise relative flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="flex items-center gap-3">
              <span
                className={`program-surface theme-${program.theme} relative grid size-12 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-ink ring-4 ring-surface`}
              >
                {index + 1}
              </span>
              <div>
                <p className="text-xs font-semibold tracking-wide text-brand-teal uppercase">{module.level}</p>
                <p className="inline-flex items-center gap-1 text-xs text-ink-soft">
                  <Clock3 aria-hidden className="size-3.5" />
                  {module.duration}
                </p>
              </div>
            </div>
            <h3 className="mt-4 text-[17px] leading-snug font-bold text-ink">{module.title}</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-soft">
              {module.topics.map((topic) => (
                <li key={topic} className="flex items-start gap-2">
                  <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-teal" />
                  {topic}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col gap-5 rounded-[var(--radius-card)] bg-brand-teal-soft p-5 md:flex-row md:items-center md:p-7">
        <div className="flex items-center gap-3 md:w-64 md:shrink-0">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-teal-strong text-white">
            <GraduationCap aria-hidden className="size-6" />
          </span>
          <h3 className="text-lg leading-snug font-bold text-ink">Setelah program, anak mampu:</h3>
        </div>
        <ul className="grid flex-1 gap-2.5 sm:grid-cols-2">
          {program.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-start gap-2 text-[14.5px] text-ink">
              <CheckCircle2 aria-hidden className="mt-0.5 size-[18px] shrink-0 text-brand-teal-dark" />
              {outcome}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
