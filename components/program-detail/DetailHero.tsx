"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, BookOpenCheck, CalendarDays, ChevronRight, MessageCircle, Tag } from "lucide-react";
import { StatusBadge } from "@/components/program/StatusBadge";
import { intentByStatus } from "@/components/program/registration";
import { RegisterButton } from "@/components/registration/RegisterButton";
import { pickFeaturedClass } from "@/lib/class-status";
import { formatDateId } from "@/lib/format";
import { useNow } from "@/lib/use-now";
import { formatRupiah } from "@/lib/whatsapp";
import type { ProgramWithClasses } from "@/types";

type DetailHeroProps = {
  program: ProgramWithClasses;
  generatedAt: number;
};

export function DetailHero({ program, generatedAt }: DetailHeroProps) {
  const now = useNow(generatedAt);
  const featured = pickFeaturedClass(program.classes, now);
  const intent = featured ? intentByStatus[featured.status] : "tanya";
  const lowestPrice = Math.min(...program.pricing.map((p) => p.price));

  return (
    <section
      aria-labelledby="program-title"
      className={`program-surface theme-${program.theme} relative isolate -mx-5 overflow-clip md:mx-0 md:rounded-[32px] md:ring-1 md:ring-[var(--pc-border)]`}
    >
      <div aria-hidden className="hero-dots absolute inset-0 -z-10 opacity-80" />

      <div className="grid items-center lg:grid-cols-[1.08fr_1fr]">
        <div className="animate-rise relative z-10 px-5 pt-6 md:px-10 md:pt-8 lg:py-12 lg:pr-4 lg:pl-12">
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink-soft">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/program" className="rounded font-medium hover:text-ink hover:underline">
                  Program
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="font-semibold text-ink">
                {program.title}
              </li>
            </ol>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {featured && <StatusBadge status={featured.status} />}
            <span className="inline-flex items-center rounded-full bg-panel px-3 py-1 text-[12px] font-semibold text-ink-soft ring-1 ring-[var(--pc-border)]">
              {program.category} · {program.ageRange}
            </span>
          </div>

          <h1
            id="program-title"
            className="mt-4 text-[38px] leading-[1.05] font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[56px]"
          >
            {program.title}
          </h1>
          <p className="mt-3 max-w-[30ch] text-lg leading-snug font-semibold text-ink md:text-xl">{program.tagline}</p>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft md:text-base">{program.longDescription}</p>

          <dl className="mt-6 grid max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-4">
            {program.facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl bg-panel px-3 py-2.5 ring-1 ring-[var(--pc-border)] backdrop-blur">
                <dt className="text-[11px] font-medium text-ink-soft">{fact.label}</dt>
                <dd className="mt-0.5 text-[13px] leading-snug font-semibold text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <RegisterButton
              programSlug={program.slug}
              classId={featured?.item.id}
              intent={intent}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1faf55] px-6 text-[15px] font-semibold text-white shadow-[0_12px_24px_-14px_rgb(31_175_85/0.95)] transition-all hover:-translate-y-0.5 hover:bg-[#1a9c4b]"
            >
              <MessageCircle aria-hidden className="size-5" />
              {intent === "daftar" ? "Daftar via WhatsApp" : "Hubungi via WhatsApp"}
            </RegisterButton>
            <a
              href="#harga"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-panel px-5 text-[15px] font-semibold text-brand-teal-dark ring-1 ring-brand-teal/25 transition-colors hover:bg-surface"
            >
              Lihat Harga
              <ArrowDown aria-hidden className="size-4" />
            </a>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[13px] text-ink-soft">
            <Tag aria-hidden className="size-3.5 text-brand-teal" />
            Mulai <strong className="font-semibold text-ink">{formatRupiah(lowestPrice)}</strong> per siswa / pertemuan
          </p>
        </div>

        <div className="relative mx-auto mt-6 w-full max-w-[380px] px-6 sm:max-w-[440px] lg:mt-0 lg:max-w-[520px] lg:self-end lg:px-0 lg:pt-10">
          <div aria-hidden className="program-blob top-[12%] left-[6%] h-[78%] w-[88%]" />
          <div aria-hidden className="program-ring top-[4%] left-[2%] aspect-square w-[96%]" />
          <Image
            src={program.image}
            alt={program.imageAlt}
            width={720}
            height={720}
            priority
            sizes="(min-width: 1024px) 480px, 80vw"
            className="program-character relative mx-auto h-auto max-h-[460px] w-auto max-w-full object-contain"
          />

          <HeroChip className="top-[14%] -left-1 lg:-left-8" delay="0s">
            <BookOpenCheck aria-hidden className="size-4 text-brand-teal-dark" />
            {program.curriculum.length} tahap kurikulum
          </HeroChip>
          {featured && (
            <HeroChip className="right-0 bottom-[16%] lg:-right-2" delay="1.3s">
              <CalendarDays aria-hidden className="size-4 text-brand-teal-dark" />
              Mulai {formatDateId(featured.item.classStarts)}
            </HeroChip>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroChip({ className, delay, children }: { className: string; delay: string; children: React.ReactNode }) {
  return (
    <div
      aria-hidden
      style={{ animationDelay: delay }}
      className={`hero-chip absolute z-10 inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-surface/90 px-3 py-2 text-[12px] font-semibold text-ink shadow-lift backdrop-blur md:text-[13px] ${className}`}
    >
      {children}
    </div>
  );
}
