import Image from "next/image";
import { Heart, Rocket, ShieldCheck, Sprout, Star, UsersRound, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { AudienceItem, ProgramWithClasses } from "@/types";

const icons: Record<AudienceItem["icon"], LucideIcon> = {
  sprout: Sprout,
  rocket: Rocket,
  heart: Heart,
  users: UsersRound,
  star: Star,
  shield: ShieldCheck,
};

export function AudienceSection({ program }: { program: ProgramWithClasses }) {
  return (
    <section id="cocok-untuk" aria-labelledby="cocok-title" className="scroll-mt-24">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading
            id="cocok-title"
            eyebrow="Cocok untuk siapa?"
            title={`${program.title} tepat untuk anak Anda jika…`}
            description={`Program ini dirancang untuk anak usia ${program.ageRange}. Kalau salah satu kondisi di samping terasa akrab, program ini bisa jadi pilihan yang tepat.`}
          />
          <div
            className={`program-surface theme-${program.theme} relative mt-6 hidden overflow-clip rounded-[var(--radius-card)] lg:block`}
          >
            <div aria-hidden className="hero-dots absolute inset-0" />
            <Image
              src={program.image}
              alt=""
              width={720}
              height={720}
              sizes="360px"
              className="relative mx-auto h-64 w-auto object-contain pt-4"
            />
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {program.audience.map((item, index) => {
            const Icon = icons[item.icon];
            return (
              <li
                key={item.title}
                className="animate-rise group rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-teal/30 hover:shadow-lift"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span
                  className={`program-surface theme-${program.theme} grid size-12 place-items-center rounded-2xl text-brand-teal-dark transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]`}
                >
                  <Icon aria-hidden className="size-6" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
