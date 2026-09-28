import Image from "next/image";
import {
  CalendarClock,
  ClipboardList,
  GraduationCap,
  HeartHandshake,
  ListChecks,
  MoonStar,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Reason } from "@/types";

const icons: Record<Reason["icon"], LucideIcon> = {
  teacher: GraduationCap,
  curriculum: ListChecks,
  islamic: MoonStar,
  "small-class": UsersRound,
  report: ClipboardList,
  schedule: CalendarClock,
};

/** Warna tile ikon bergantian agar grid terasa hidup namun tetap dalam palet brand. */
const tones = [
  "bg-brand-teal-soft text-brand-teal-dark",
  "bg-brand-yellow-soft text-warn",
  "bg-soft-blue text-brand-teal-dark",
  "bg-soft-green text-brand-teal-dark",
  "bg-soft-purple text-accent-purple-ink",
  "bg-soft-cream text-warn",
];

export function WhyChooseUs({ items }: { items: Reason[] }) {
  return (
    <section aria-labelledby="alasan-title" className="mt-16 md:mt-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:gap-10">
        {/* Kolom kiri: judul + ilustrasi (menempel saat scroll di desktop) */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <Reveal>
            <SectionHeading
              id="alasan-title"
              eyebrow="Kenapa Partner Belajar?"
              title="Alasan orang tua mempercayakan belajar anaknya kepada kami"
              description="Kami percaya setiap anak bisa berkembang pesat bila didampingi dengan cara yang tepat, sabar, dan penuh kasih."
            />
          </Reveal>

          <Reveal delay={120} className="relative mt-6 overflow-clip rounded-[28px]">
            <div className="program-surface theme-yellow relative isolate px-6 pt-6">
              <div aria-hidden className="hero-dots absolute inset-0 -z-10" />
              <div aria-hidden className="program-blob top-[18%] left-[12%] h-[70%] w-[76%]" />
              <Image
                src="/characters/diniyyah.webp"
                alt="Ilustrasi keluarga Muslim bersama anak-anak yang siap belajar"
                width={720}
                height={720}
                sizes="(min-width: 1024px) 380px, 90vw"
                className="program-character relative mx-auto h-auto w-full max-w-[320px]"
              />
              <div className="why-badge absolute top-5 right-5 flex items-center gap-2 rounded-2xl bg-surface/90 px-3 py-2 text-[12.5px] font-semibold text-ink shadow-lift backdrop-blur">
                <HeartHandshake aria-hidden className="size-4 text-brand-teal" />
                Tumbuh bersama keluarga
              </div>
            </div>
          </Reveal>

          <Reveal delay={200} className="mt-6 hidden lg:block">
            <ButtonLink href="/program">Lihat Program</ButtonLink>
          </Reveal>
        </div>

        {/* Kolom kanan: 6 alasan */}
        <ol className="grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => {
            const Icon = icons[item.icon];
            return (
              <Reveal as="li" key={item.id} delay={(index % 2) * 90 + Math.floor(index / 2) * 60}>
                <article className="why-card group relative h-full overflow-clip rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <span
                    aria-hidden
                    className="absolute top-4 right-5 text-[44px] leading-none font-extrabold text-brand-teal/[0.07] transition-colors duration-300 group-hover:text-brand-teal/15"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`grid size-13 place-items-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${tones[index % tones.length]}`}
                  >
                    <Icon aria-hidden className="size-6" strokeWidth={2} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>
                </article>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
