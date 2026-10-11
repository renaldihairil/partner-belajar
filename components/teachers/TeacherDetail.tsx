import Image from "next/image";
import Link from "next/link";
import { Award, BadgeCheck, GraduationCap, MessageCircle } from "lucide-react";
import { RegisterButton } from "@/components/registration/RegisterButton";
import type { Program, Teacher } from "@/types";
import { TeacherAvatar } from "./TeacherAvatar";

/** Isi jendela detail pengajar: profil lengkap, bio utuh, keunggulan, program, dan ajakan belajar. */
export function TeacherDetail({ teacher, programs, onNavigate }: { teacher: Teacher; programs: Program[]; onNavigate: () => void }) {
  const teacherPrograms = teacher.programIds
    .map((id) => programs.find((p) => p.id === id))
    .filter((p): p is Program => Boolean(p));
  const primary = teacherPrograms[0];
  // "Ustadzah Hana Salsabila" → "Ustadzah Hana"; "Kak Nadia Putri" → "Kak Nadia"
  const [honorific, first] = teacher.name.split(" ");
  const callName = first ? `${honorific} ${first}` : teacher.name;

  return (
    <article>
      <div className={`program-surface theme-${primary?.theme ?? "blue"} relative h-28`}>
        <div aria-hidden className="hero-dots absolute inset-0" />
      </div>

      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <div className="-mt-14 flex items-end gap-3">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-[30px] bg-surface p-1 shadow-lift ring-1 ring-line">
            <div className={`program-surface theme-${primary?.theme ?? "blue"} size-full overflow-hidden rounded-[26px]`}>
              {teacher.photo ? (
                <Image src={teacher.photo} alt={teacher.name} width={240} height={240} className="size-full object-cover" />
              ) : (
                <TeacherAvatar teacher={teacher} className="size-full" />
              )}
            </div>
          </div>
          <BadgeCheck aria-label="Pengajar terverifikasi" className="mb-1 size-6 text-brand-teal" />
        </div>

        <h2 className="mt-4 text-2xl leading-snug font-bold text-ink">{teacher.name}</h2>
        <p className="text-[15px] font-medium text-brand-teal-dark">{teacher.title}</p>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-ink-soft">
          <li className="inline-flex items-center gap-1.5">
            <Award aria-hidden className="size-4 text-brand-teal" />
            {teacher.experienceYears} tahun mengajar
          </li>
          {teacher.education && (
            <li className="inline-flex items-center gap-1.5">
              <GraduationCap aria-hidden className="size-4 text-brand-teal" />
              {teacher.education}
            </li>
          )}
        </ul>

        <p className="mt-4 text-[15px] leading-relaxed whitespace-pre-line text-ink-soft">{teacher.bio}</p>

        {teacher.highlights.length > 0 && (
          <>
            <h3 className="mt-5 text-sm font-bold text-ink">Keunggulan</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {teacher.highlights.map((highlight) => (
                <li key={highlight} className="rounded-full bg-background px-3 py-1 text-[12.5px] font-medium text-ink ring-1 ring-line">
                  {highlight}
                </li>
              ))}
            </ul>
          </>
        )}

        {teacherPrograms.length > 0 && (
          <>
            <h3 className="mt-5 text-sm font-bold text-ink">Program yang diajar</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {teacherPrograms.map((program) => (
                <li key={program.id}>
                  <Link
                    href={`/program/${program.slug}`}
                    onClick={onNavigate}
                    className={`program-surface theme-${program.theme} inline-block rounded-full px-3 py-1 text-[12.5px] font-semibold text-ink ring-1 ring-[var(--pc-border)] transition-transform hover:-translate-y-0.5`}
                  >
                    {program.title}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {primary && (
          <div onClick={onNavigate}>
            <RegisterButton
              programSlug={primary.slug}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-teal-strong px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-teal-dark"
            >
              <MessageCircle aria-hidden className="size-5" />
              Belajar bersama {callName}
            </RegisterButton>
          </div>
        )}
      </div>
    </article>
  );
}
