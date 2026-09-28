import type { CSSProperties } from "react";
import { CalendarCheck2, GraduationCap, Star, UsersRound, type LucideIcon } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { LeafCloud } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import type { Stat } from "@/types";

const icons: Record<Stat["icon"], LucideIcon> = {
  students: UsersRound,
  teachers: GraduationCap,
  sessions: CalendarCheck2,
  rating: Star,
};

export function StatsSection({ items }: { items: Stat[] }) {
  return (
    <section
      aria-labelledby="statistik-title"
      data-countup-trigger
      className="stats-band relative isolate mt-16 -mx-5 overflow-clip px-5 py-12 text-white md:mx-0 md:mt-20 md:rounded-[32px] md:px-10 md:py-14"
    >
      {/* Latar: gradien teal, pola titik, blob bergerak, awan */}
      <div aria-hidden className="stats-dots absolute inset-0 -z-10" />
      <div aria-hidden className="hero-blob stats-blob stats-blob--yellow" />
      <div aria-hidden className="hero-blob stats-blob stats-blob--mint" />
      <LeafCloud className="pointer-events-none absolute -right-8 -bottom-6 -z-10 w-44 text-white/10" />
      <LeafCloud className="pointer-events-none absolute top-6 left-[38%] -z-10 hidden w-24 text-white/10 md:block" />

      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] font-semibold tracking-wide text-brand-yellow uppercase">Partner Belajar dalam angka</p>
        <h2 id="statistik-title" className="mt-1.5 text-[28px] leading-tight font-extrabold tracking-tight md:text-[40px]">
          Tumbuh bersama ratusan keluarga
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-white/85 md:text-base">
          Kepercayaan orang tua adalah semangat kami untuk terus memberikan pendampingan terbaik.
        </p>
      </Reveal>

      <ul className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {items.map((stat, index) => {
          const Icon = icons[stat.icon];
          return (
            <Reveal as="li" key={stat.id} delay={index * 110}>
              <div className="stat-card group relative h-full overflow-clip rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 md:p-6">
                <span
                  style={{ "--halo-delay": `${index * 0.7}s` } as CSSProperties}
                  className="stat-icon relative grid size-11 place-items-center rounded-2xl bg-brand-yellow text-on-accent shadow-[0_10px_24px_-10px_rgb(248_192_48/0.9)] md:size-12">
                  <Icon aria-hidden className="size-5 md:size-6" strokeWidth={2.2} fill={stat.icon === "rating" ? "currentColor" : "none"} />
                </span>
                <p className="mt-4 text-[30px] leading-none font-extrabold tracking-tight md:mt-5 md:text-[44px]">
                  {/* Berhitung dari 1 saat section terlihat & setiap kursor diarahkan ke section */}
                  <CountUp
                    value={stat.value}
                    from={1}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={1800}
                    replay
                  />
                </p>
                <p className="mt-2 text-[14px] font-semibold md:text-base">{stat.label}</p>
                <p className="mt-0.5 text-[12px] text-white/75 md:text-[13px]">{stat.caption}</p>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
