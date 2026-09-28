import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { RegisterButton } from "@/components/registration/RegisterButton";
import { LeafCloud } from "@/components/ui/Decor";
import { whatsappUrl } from "@/lib/whatsapp";
import type { ProgramWithClasses } from "@/types";

type FinalCtaProps = {
  program: ProgramWithClasses;
  others: ProgramWithClasses[];
};

export function FinalCta({ program, others }: FinalCtaProps) {
  return (
    <>
      <section
        aria-labelledby="cta-title"
        className="relative isolate -mx-5 overflow-clip bg-brand-teal-strong text-white md:mx-0 md:rounded-[32px]"
      >
        <LeafCloud className="pointer-events-none absolute -bottom-8 -left-8 -z-10 w-48 text-white/10" />
        <LeafCloud className="pointer-events-none absolute -top-6 right-[30%] -z-10 w-32 text-white/10" />
        <div className="grid items-end gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="px-6 py-10 md:py-12 md:pl-10 lg:pl-12">
            <h2 id="cta-title" className="text-[28px] leading-tight font-extrabold md:text-4xl">
              Siap mulai belajar bersama {program.title}?
            </h2>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-white/90 md:text-base">
              Isi formulir singkat, lalu lanjutkan di WhatsApp. Admin kami akan membantu memilih jadwal dan paket terbaik
              untuk anak Anda.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <RegisterButton
                programSlug={program.slug}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-yellow px-6 text-[15px] font-bold text-on-accent shadow-[0_12px_24px_-14px_rgb(0_0_0/0.5)] transition-all hover:-translate-y-0.5 hover:bg-[#fac93f]"
              >
                <MessageCircle aria-hidden className="size-5" />
                Daftar via WhatsApp
              </RegisterButton>
              <a
                href={whatsappUrl(`Assalamu'alaikum Admin Partner Belajar, saya ingin bertanya tentang ${program.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-[15px] font-semibold text-white ring-1 ring-white/50 transition-colors hover:bg-white/10"
              >
                Tanya dulu
              </a>
            </div>
          </div>
          <div className="relative hidden justify-center self-end md:flex">
            <Image src={program.image} alt="" width={720} height={720} sizes="300px" className="h-60 w-auto object-contain lg:h-72" />
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section aria-labelledby="lainnya-title">
          <h2 id="lainnya-title" className="text-xl font-bold text-ink md:text-2xl">
            Program lainnya
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {others.map((other) => (
              <li key={other.id}>
                <Link
                  href={`/program/${other.slug}`}
                  className={`program-surface theme-${other.theme} group flex items-center gap-3 rounded-[22px] p-3 ring-1 ring-[var(--pc-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lift`}
                >
                  <Image src={other.image} alt="" width={720} height={720} sizes="64px" className="h-16 w-16 object-contain" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-ink">{other.title}</span>
                    <span className="block truncate text-[12.5px] text-ink-soft">{other.category} · {other.ageRange}</span>
                  </span>
                  <ArrowUpRight aria-hidden className="size-5 text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
