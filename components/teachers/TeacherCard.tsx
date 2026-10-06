import Image from "next/image";
import Link from "next/link";
import { Award, BadgeCheck, GraduationCap, MessageCircle } from "lucide-react";
import { RegisterButton } from "@/components/registration/RegisterButton";
import type { Program, Teacher } from "@/types";
import { TeacherAvatar } from "./TeacherAvatar";

type TeacherCardProps = {
  teacher: Teacher;
  programs: Program[];
};

export function TeacherCard({ teacher, programs }: TeacherCardProps) {
  const teacherPrograms = teacher.programIds
    .map((id) => programs.find((p) => p.id === id))
    .filter((p): p is Program => Boolean(p));
  const primary = teacherPrograms[0];
  // "Ustadzah Hana Salsabila" → "Ustadzah Hana"; "Kak Nadia Putri" → "Kak Nadia"
  const [honorific, first] = teacher.name.split(" ");
  const callName = first ? `${honorific} ${first}` : teacher.name;

  return (
    <article className="group flex h-full flex-col overflow-clip rounded-[28px] border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      {/* Sampul bertema program utama */}
      <div className={`program-surface theme-${primary?.theme ?? "blue"} relative h-28`}>
        <div aria-hidden className="hero-dots absolute inset-0" />
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-panel px-2.5 py-1 text-[11.5px] font-semibold text-ink ring-1 ring-[var(--pc-border)] backdrop-blur">
          <Award aria-hidden className="size-3.5 text-brand-teal" />
          {teacher.experienceYears} th mengajar
        </span>
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-5">
        <div className="-mt-14 flex items-end gap-3">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-[26px] bg-surface p-1 shadow-lift ring-1 ring-line transition-transform duration-500 group-hover:-rotate-3">
            <div className={`program-surface theme-${primary?.theme ?? "blue"} size-full overflow-hidden rounded-[22px]`}>
              {teacher.photo ? (
                <Image src={teacher.photo} alt={teacher.name} width={200} height={200} className="size-full object-cover" />
              ) : (
                <TeacherAvatar teacher={teacher} className="size-full" />
              )}
            </div>
          </div>
          <BadgeCheck aria-label="Pengajar terverifikasi" className="mb-1 size-6 text-brand-teal" />
        </div>

        <h2 className="mt-3 text-lg leading-snug font-bold text-ink">{teacher.name}</h2>
        <p className="text-sm font-medium text-brand-teal-dark">{teacher.title}</p>
        {teacher.education && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] text-ink-soft">
            <GraduationCap aria-hidden className="size-4 text-brand-teal" />
            {teacher.education}
          </p>
        )}

        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{teacher.bio}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {teacher.highlights.map((highlight) => (
            <li key={highlight} className="rounded-full bg-background px-2.5 py-1 text-[11.5px] font-medium text-ink ring-1 ring-line">
              {highlight}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {teacherPrograms.map((program) => (
            <Link
              key={program.id}
              href={`/program/${program.slug}`}
              className={`program-surface theme-${program.theme} rounded-full px-3 py-1 text-[12px] font-semibold text-ink ring-1 ring-[var(--pc-border)] transition-transform hover:-translate-y-0.5`}
            >
              {program.title}
            </Link>
          ))}
        </div>

        {primary && (
          <RegisterButton
            programSlug={primary.slug}
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-teal-soft px-4 text-sm font-semibold text-brand-teal-dark transition-colors hover:bg-brand-teal-strong hover:text-white"
          >
            <MessageCircle aria-hidden className="size-4" />
            Belajar bersama {callName}
          </RegisterButton>
        )}
      </div>
    </article>
  );
}
