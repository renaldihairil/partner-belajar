import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Clock,
  Info,
  ListChecks,
  MapPin,
  MonitorSmartphone,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { RegisterButton } from "@/components/registration/RegisterButton";
import { modeLabel, pickFeaturedClass, seatsLeft } from "@/lib/class-status";
import { formatDays } from "@/lib/format";
import type { ProgramClass, ProgramWithClasses, RegistrationStatus } from "@/types";
import { QuotaBar } from "./QuotaBar";
import { ctaLabel, ctaStyles, intentByStatus } from "./registration";
import { StatusBadge } from "./StatusBadge";

/** Kalimat ringkas yang menjelaskan status pendaftaran sebuah kelas (kelas dibuka setiap hari). */
export function statusMessage(item: ProgramClass, status: RegistrationStatus) {
  switch (status) {
    case "open": {
      const left = seatsLeft(item);
      return {
        icon: CalendarCheck,
        text: "Pendaftaran dibuka setiap hari",
        suffix: left !== null && left <= 3 ? `Sisa ${left} kursi` : null,
      };
    }
    case "full":
      return { icon: ListChecks, text: "Kuota penuh, daftar tunggu tersedia", suffix: null };
    case "closed":
      return { icon: Info, text: "Sementara tidak menerima pendaftaran baru", suffix: null };
  }
}

type ProgramCardProps = {
  program: ProgramWithClasses;
  priority?: boolean;
};

export function ProgramCard({ program, priority }: ProgramCardProps) {
  const featured = pickFeaturedClass(program.classes);
  const item = featured?.item ?? null;
  const status = featured?.status ?? null;
  const message = item && status ? statusMessage(item, status) : null;
  const intent = status ? intentByStatus[status] : "tanya";
  const href = `/program/${program.slug}`;
  const titleId = `program-${program.slug}`;

  return (
    <article
      aria-labelledby={titleId}
      className={`program-card theme-${program.theme} group flex h-full flex-col lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0`}
    >
      {/* Baris 1: visual + judul (tinggi disamakan antar kartu sebaris lewat subgrid) */}
      <div className="grid grid-cols-[40%_1fr] sm:grid-cols-[42%_1fr]">
        <div className="relative flex min-h-[200px] items-end justify-center pt-8 sm:min-h-[236px]">
          <div aria-hidden className="program-blob top-[16%] left-[8%] h-[72%] w-[86%]" />
          <div aria-hidden className="program-ring top-[8%] left-[3%] aspect-square w-[94%]" />
          <div className="program-character-wrap relative flex h-[170px] w-[92%] items-end justify-center sm:h-[210px]">
            <Image
              src={program.image}
              alt={program.imageAlt}
              width={720}
              height={720}
              sizes="(min-width: 1024px) 240px, 40vw"
              priority={priority}
              className="program-character h-full w-auto max-w-full object-contain object-bottom"
            />
          </div>
        </div>

        <div className="flex flex-col py-5 pr-4 pl-1 sm:py-6 sm:pr-6">
          <div className="flex flex-wrap items-center gap-2">{status ? <StatusBadge status={status} /> : null}</div>
          <p className="mt-3 text-[11.5px] font-semibold tracking-wide text-ink-soft uppercase">
            {program.category} · {program.ageRange}
          </p>
          <h2 id={titleId} className="mt-1 text-[22px] leading-[1.1] font-extrabold tracking-tight text-ink sm:text-[28px]">
            {/* Link membentang: seluruh kartu bisa diklik menuju halaman detail. */}
            <Link
              href={href}
              className="rounded-md after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[28px] focus-visible:after:outline-3 focus-visible:after:outline-offset-[-3px] focus-visible:after:outline-brand-yellow-dark"
            >
              {program.title}
            </Link>
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-soft sm:text-sm">{program.description}</p>
        </div>
      </div>

      {/* Baris 2: panel info kelas — tingginya sama untuk kartu sebaris */}
      <div className="relative z-[2] mx-3 -mt-5 mb-3 flex flex-1 flex-col rounded-[22px] bg-panel p-4 ring-1 ring-[var(--pc-border)] backdrop-blur-md sm:p-5">
        {item && status && message ? (
          <>
            <p className="flex min-h-6 items-center gap-2 text-[13px] font-semibold text-ink">
              <message.icon aria-hidden className="size-4 shrink-0 text-brand-teal" />
              <span className="min-w-0">
                {message.text}
                {message.suffix && (
                  <span className="ml-1.5 inline-block rounded-full bg-brand-yellow-soft px-2 py-0.5 text-[11px] font-semibold text-warn">
                    {message.suffix}
                  </span>
                )}
              </span>
            </p>

            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 text-[12.5px]">
              <InfoItem icon={CalendarCheck} label="Pendaftaran" value={status === "open" ? "Setiap hari" : status === "full" ? "Kuota penuh" : "Sementara ditutup"} />
              <InfoItem icon={Clock} label="Jadwal" value={`${formatDays(item.days)} · ${item.time.replace(" WIB", "")}`} />
              <InfoItem icon={item.mode === "online" ? MonitorSmartphone : MapPin} label="Mode" value={modeLabel[item.mode]} />
              <InfoItem icon={UsersRound} label="Kelas" value={item.name} />
            </dl>

            <div className="mt-3.5">
              <QuotaBar item={item} status={status} compact />
            </div>
          </>
        ) : (
          <p className="text-[13px] text-ink-soft">Jadwal kelas sedang disiapkan. Hubungi kami untuk info jadwal.</p>
        )}

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-4">
          <RegisterButton
            programSlug={program.slug}
            classId={item?.id}
            intent={intent}
            className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-full px-3 text-[13.5px] font-semibold whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 sm:px-4 ${
              status ? ctaStyles[status] : ctaStyles.closed
            }`}
          >
            <span className="sm:hidden">{ctaLabel[intent].short}</span>
            <span className="hidden sm:inline">{ctaLabel[intent].long}</span>
            <ArrowRight aria-hidden className="size-4 shrink-0" />
          </RegisterButton>
          <Link
            href={href}
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-full bg-panel px-3.5 text-[13.5px] font-semibold whitespace-nowrap text-brand-teal-dark ring-1 ring-brand-teal/30 transition-colors hover:bg-brand-teal-soft sm:px-4"
          >
            Detail
            <ArrowUpRight aria-hidden className="size-4" />
            <span className="sr-only">{program.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon aria-hidden className="mt-0.5 size-3.5 shrink-0 text-brand-teal" />
      <div className="min-w-0">
        <dt className="text-[11px] text-ink-soft">{label}</dt>
        <dd className="truncate font-semibold text-ink" title={value}>
          {value}
        </dd>
      </div>
    </div>
  );
}
