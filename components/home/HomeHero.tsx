import { BookOpenText, CheckCircle2, HeartHandshake, Sparkles, Star, type LucideIcon } from "lucide-react";
import { CharacterIllustration } from "@/components/character/CharacterIllustration";
import { ButtonLink } from "@/components/ui/Button";
import { SunRays } from "@/components/ui/Decor";
import { programs } from "@/data/programs";

const highlights = ["Metode interaktif", "Nilai-nilai Islami", "Laporan untuk orang tua"];

export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate -mx-5 overflow-clip md:mx-0 md:rounded-[32px] md:ring-1 md:ring-line"
    >
      <HeroBackdrop />

      <div className="grid items-center lg:grid-cols-[1.02fr_1fr]">
        {/* Teks */}
        <div className="animate-rise relative z-10 px-5 pt-7 md:px-10 md:pt-12 lg:py-16 lg:pr-4 lg:pl-12 xl:pl-14">
          <SunRays className="absolute top-3 left-2 hidden w-11 lg:block xl:left-5" />
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-teal/15 bg-surface/80 py-1.5 pr-4 pl-2 text-[13px] font-medium text-ink shadow-soft backdrop-blur">
            <span className="grid size-6 place-items-center rounded-full bg-brand-yellow text-on-accent">
              <Sparkles aria-hidden className="size-3.5" strokeWidth={2.4} />
            </span>
            Belajar seru untuk anak Muslim
          </p>

          <h1
            id="hero-title"
            className="mt-4 max-w-[13ch] text-[36px] md:mt-5 leading-[1.08] font-extrabold tracking-tight text-ink sm:text-[46px] lg:text-[54px] xl:text-[60px]"
          >
            Bersama Tumbuh, Raih{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">Masa Depan</span>
              <svg
                aria-hidden
                viewBox="0 0 300 24"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-[0.42em] w-full"
              >
                <path
                  d="M4 16 C 70 4, 150 4, 296 12"
                  pathLength={1}
                  className="hero-underline"
                  fill="none"
                  stroke="var(--brand-yellow)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-4 max-w-[38ch] text-[15px] md:mt-5 leading-relaxed text-ink-soft md:text-[17px]">
            Program belajar yang dirancang untuk membantu setiap anak mengembangkan potensi terbaiknya.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 md:mt-7 md:gap-3">
            <ButtonLink href="/program" className="max-sm:!px-4">
              Mulai Sekarang
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" withArrow={false} className="max-sm:!px-4">
              Hubungi Kami
            </ButtonLink>
          </div>

          <ul className="mt-7 hidden flex-wrap sm:flex gap-x-5 gap-y-2 text-[13px] font-medium text-ink-soft md:text-sm">
            {highlights.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 aria-hidden className="size-4 text-brand-teal" strokeWidth={2.4} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <div className="relative mx-auto mt-6 w-full max-w-[400px] px-4 sm:max-w-[460px] lg:mt-0 lg:max-w-[560px] lg:self-end lg:px-0 lg:pt-10">
          {/* Lingkaran cahaya & orbit */}
          <div aria-hidden className="absolute inset-x-[4%] top-[6%] aspect-square">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--hero-glow)_0%,var(--brand-yellow-soft)_45%,var(--brand-teal-soft)_68%,transparent_71%)]" />
            <div className="hero-orbit absolute inset-[-5%] rounded-full border-2 border-dashed border-brand-teal/20">
              <span className="absolute top-[12%] left-[12%] size-3.5 rounded-full bg-brand-yellow shadow-[0_0_0_5px_rgb(248_192_48/0.25)]" />
              <span className="absolute right-[3%] bottom-[30%] size-2.5 rounded-full bg-brand-teal" />
            </div>
            <div className="absolute inset-[-14%] rounded-full border border-brand-teal/10" />
          </div>

          <Twinkle className="top-[8%] right-[8%] size-6 text-brand-yellow" delay="0s" />
          <Twinkle className="top-[38%] left-[0%] size-4 text-brand-teal" delay="1.2s" />
          <Twinkle className="top-[2%] left-[30%] size-3 text-brand-teal/70" delay="2.1s" />

          <CharacterIllustration
            src="/characters/hero-kids.webp"
            alt="Ilustrasi anak laki-laki berpeci melambaikan tangan dan anak perempuan berhijab memeluk buku, siap belajar"
            width={1200}
            height={1158}
            sizes="(min-width: 1280px) 560px, (min-width: 1024px) 42vw, (min-width: 640px) 460px, 92vw"
            priority
            className="hero-character relative w-full"
          />

          <FloatingChip
            icon={BookOpenText}
            tone="teal"
            title={`${programs.length} Program`}
            subtitle="Pilihan belajar"
            className="top-[18%] -left-1 sm:-left-4 lg:top-[22%] lg:-left-10"
            delay="0s"
          />
          <FloatingChip
            icon={Star}
            tone="yellow"
            title="Interaktif"
            subtitle="Seru & menyenangkan"
            className="top-[46%] right-0 sm:-right-3 lg:top-[40%] lg:right-3"
            delay="1.4s"
          />
          <FloatingChip
            icon={HeartHandshake}
            tone="teal"
            title="Pendamping sabar"
            subtitle="Tim profesional"
            className="bottom-[12%] -left-1 hidden sm:flex lg:-left-6"
            delay="2.6s"
          />
        </div>
      </div>
    </section>
  );
}

/** Latar hero: gradien lembut, blob pastel yang bergerak pelan, dan pola titik. Murni CSS. */
function HeroBackdrop() {
  return (
    <div aria-hidden className="hero-backdrop absolute inset-0 -z-10">
      <div className="hero-blob hero-blob--yellow" />
      <div className="hero-blob hero-blob--teal" />
      <div className="hero-blob hero-blob--blue" />
      <div className="hero-dots absolute inset-0" />
    </div>
  );
}

type FloatingChipProps = {
  icon: LucideIcon;
  tone: "teal" | "yellow";
  title: string;
  subtitle: string;
  className: string;
  delay: string;
};

function FloatingChip({ icon: Icon, tone, title, subtitle, className, delay }: FloatingChipProps) {
  return (
    <div
      aria-hidden
      style={{ animationDelay: delay }}
      className={`hero-chip absolute z-10 flex items-center gap-2.5 rounded-2xl border border-white/70 bg-surface/90 py-2 pr-3.5 pl-2 shadow-lift backdrop-blur ${className}`}
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-xl md:size-9 ${
          tone === "teal" ? "bg-brand-teal-soft text-brand-teal-dark" : "bg-brand-yellow-soft text-brand-yellow-dark"
        }`}
      >
        <Icon className="size-4 md:size-[18px]" strokeWidth={2.2} fill="currentColor" fillOpacity={0.15} />
      </span>
      <span className="leading-tight">
        <span className="block text-[12px] font-semibold text-ink md:text-[13px]">{title}</span>
        <span className="block text-[10.5px] text-ink-soft md:text-[11.5px]">{subtitle}</span>
      </span>
    </div>
  );
}

function Twinkle({ className, delay }: { className: string; delay: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      style={{ animationDelay: delay }}
      className={`hero-twinkle absolute z-10 ${className}`}
      fill="currentColor"
    >
      <path d="M12 0c.7 6.3 5 10.9 12 12-7 1.1-11.3 5.7-12 12-.7-6.3-5-10.9-12-12C7 10.9 11.3 6.3 12 0z" />
    </svg>
  );
}
