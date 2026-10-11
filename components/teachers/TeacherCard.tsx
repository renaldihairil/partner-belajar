import Image from "next/image";
import { Award, BadgeCheck, ChevronRight, GraduationCap } from "lucide-react";
import type { Program, Teacher } from "@/types";
import { TeacherAvatar } from "./TeacherAvatar";

type TeacherCardProps = {
  teacher: Teacher;
  programs: Program[];
  onOpen: () => void;
};

/** Berapa label yang ditampilkan di kartu; sisanya diringkas "+N" dan lengkap di jendela detail. */
const MAX_HIGHLIGHTS = 2;
const MAX_PROGRAMS = 2;

/**
 * Kartu ringkas pengajar: semua kartu berukuran sama (bio dipotong 3 baris);
 * klik membuka profil lengkap (lihat TeacherDetail).
 */
export function TeacherCard({ teacher, programs, onOpen }: TeacherCardProps) {
  const teacherPrograms = teacher.programIds
    .map((id) => programs.find((p) => p.id === id))
    .filter((p): p is Program => Boolean(p));
  const primary = teacherPrograms[0];
  const extraHighlights = teacher.highlights.length - MAX_HIGHLIGHTS;
  const extraPrograms = teacherPrograms.length - MAX_PROGRAMS;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`Lihat profil lengkap ${teacher.name}`}
      className="group flex h-full w-full flex-col overflow-clip rounded-[28px] border border-line bg-surface text-left shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
    >
      {/* Sampul bertema program utama */}
      <div className={`program-surface theme-${primary?.theme ?? "blue"} relative h-24 w-full shrink-0`}>
        <div aria-hidden className="hero-dots absolute inset-0" />
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-panel px-2.5 py-1 text-[11.5px] font-semibold text-ink ring-1 ring-[var(--pc-border)] backdrop-blur">
          <Award aria-hidden className="size-3.5 text-brand-teal" />
          {teacher.experienceYears} th mengajar
        </span>
      </div>

      <div className="relative flex w-full flex-1 flex-col px-5 pb-5">
        <div className="-mt-12 flex items-end gap-3">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-[26px] bg-surface p-1 shadow-lift ring-1 ring-line transition-transform duration-500 group-hover:-rotate-3">
            <div className={`program-surface theme-${primary?.theme ?? "blue"} size-full overflow-hidden rounded-[22px]`}>
              {teacher.photo ? (
                <Image src={teacher.photo} alt="" width={200} height={200} className="size-full object-cover" />
              ) : (
                <TeacherAvatar teacher={teacher} className="size-full" />
              )}
            </div>
          </div>
          <BadgeCheck aria-hidden className="mb-1 size-6 text-brand-teal" />
        </div>

        <h2 className="mt-3 line-clamp-1 text-lg leading-snug font-bold text-ink">{teacher.name}</h2>
        <p className="line-clamp-2 min-h-10 text-sm leading-5 font-medium text-brand-teal-dark">{teacher.title}</p>

        <p className="mt-2 flex min-h-5 items-center gap-1.5 text-[12.5px] text-ink-soft">
          {teacher.education && (
            <>
              <GraduationCap aria-hidden className="size-4 shrink-0 text-brand-teal" />
              <span className="line-clamp-1">{teacher.education}</span>
            </>
          )}
        </p>

        <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-ink-soft">{teacher.bio}</p>

        <ul className="mt-3 flex min-h-7 flex-wrap gap-1.5 overflow-hidden">
          {teacher.highlights.slice(0, MAX_HIGHLIGHTS).map((highlight) => (
            <li key={highlight} className="max-w-full truncate rounded-full bg-background px-2.5 py-1 text-[11.5px] font-medium text-ink ring-1 ring-line">
              {highlight}
            </li>
          ))}
          {extraHighlights > 0 && (
            <li className="rounded-full bg-background px-2.5 py-1 text-[11.5px] font-medium text-ink-soft ring-1 ring-line">+{extraHighlights}</li>
          )}
        </ul>

        <ul className="mt-3 flex min-h-7 flex-wrap gap-1.5">
          {teacherPrograms.slice(0, MAX_PROGRAMS).map((program) => (
            <li
              key={program.id}
              className={`program-surface theme-${program.theme} rounded-full px-3 py-1 text-[12px] font-semibold text-ink ring-1 ring-[var(--pc-border)]`}
            >
              {program.title}
            </li>
          ))}
          {extraPrograms > 0 && (
            <li className="rounded-full bg-background px-2.5 py-1 text-[12px] font-semibold text-ink-soft ring-1 ring-line">+{extraPrograms}</li>
          )}
        </ul>

        <span className="mt-auto flex items-center justify-between border-t border-line pt-4 text-sm font-semibold text-brand-teal-dark">
          Lihat profil lengkap
          <ChevronRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}
