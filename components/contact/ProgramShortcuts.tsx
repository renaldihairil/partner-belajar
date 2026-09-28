import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Program } from "@/types";

/** Pintasan ke halaman detail program — memudahkan pengunjung yang masih memilih. */
export function ProgramShortcuts({ programs }: { programs: Program[] }) {
  return (
    <section aria-labelledby="shortcut-title" className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-soft md:p-6">
      <h2 id="shortcut-title" className="text-lg font-bold text-ink">
        Masih memilih program?
      </h2>
      <p className="mt-1 text-sm text-ink-soft">Lihat kurikulum, jadwal, dan harga tiap program.</p>
      <ul className="mt-4 grid gap-2.5">
        {programs.map((program) => (
          <li key={program.id}>
            <Link
              href={`/program/${program.slug}`}
              className={`program-surface theme-${program.theme} group flex items-center gap-3 rounded-2xl p-2.5 pr-4 ring-1 ring-[var(--pc-border)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft`}
            >
              <Image src={program.image} alt="" width={720} height={720} sizes="48px" className="size-12 object-contain" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ink">{program.title}</span>
                <span className="block truncate text-xs text-ink-soft">
                  {program.category} · {program.ageRange}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
