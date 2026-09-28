"use client";

import { ArrowRight, CalendarDays, CalendarRange, Clock, MapPin, MonitorSmartphone, type LucideIcon } from "lucide-react";
import { statusMessage } from "@/components/program/ProgramCard";
import { QuotaBar } from "@/components/program/QuotaBar";
import { StatusBadge } from "@/components/program/StatusBadge";
import { ctaLabel, ctaStyles, intentByStatus } from "@/components/program/registration";
import { RegisterButton } from "@/components/registration/RegisterButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { modeLabel, sortClasses } from "@/lib/class-status";
import { formatDateId, formatDateLongId, formatDays } from "@/lib/format";
import { useNow } from "@/lib/use-now";
import type { ProgramWithClasses } from "@/types";

export function ScheduleSection({ program, generatedAt }: { program: ProgramWithClasses; generatedAt: number }) {
  const now = useNow(generatedAt);
  const classes = sortClasses(program.classes, now);

  return (
    <section id="jadwal" aria-labelledby="jadwal-title" className="scroll-mt-24">
      <SectionHeading
        id="jadwal-title"
        eyebrow="Jadwal kelas"
        title="Pilih jadwal yang pas"
        description="Status pendaftaran diperbarui otomatis. Belum ada jadwal yang cocok? Pilih “Belum menentukan” saat mendaftar, admin akan merekomendasikan."
      />

      {classes.length === 0 ? (
        <p className="mt-6 rounded-[var(--radius-card)] bg-background p-6 text-ink-soft">
          Jadwal kelas berikutnya sedang disiapkan. Hubungi kami untuk mendapatkan kabar terbaru.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {classes.map(({ item, status }) => {
            const message = statusMessage(item, status, now);
            const intent = intentByStatus[status];
            return (
              <li key={item.id} className="flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-[17px] font-bold text-ink">{item.name}</h3>
                  <StatusBadge status={status} className="shadow-none ring-1 ring-line" />
                </div>
                {item.note && <p className="mt-1 text-[13.5px] text-ink-soft">{item.note}</p>}

                <dl className="mt-4 grid gap-x-4 gap-y-3 text-[13px] sm:grid-cols-2">
                  <Row icon={CalendarDays} label="Kelas mulai" value={formatDateLongId(item.classStarts)} />
                  <Row icon={Clock} label="Jadwal" value={`${formatDays(item.days, false)}, ${item.time}`} />
                  <Row
                    icon={item.mode === "online" ? MonitorSmartphone : MapPin}
                    label="Mode"
                    value={item.location ? `${modeLabel[item.mode]} · ${item.location}` : modeLabel[item.mode]}
                  />
                  <Row
                    icon={CalendarRange}
                    label="Periode pendaftaran"
                    value={`${formatDateId(item.registrationOpens)} – ${formatDateId(item.registrationCloses)}`}
                  />
                </dl>

                <div className="mt-4">
                  <QuotaBar item={item} status={status} />
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <p className="flex items-center gap-1.5 text-[13px] font-medium text-ink-soft">
                    <message.icon aria-hidden className="size-4 text-brand-teal" />
                    {message.text}
                    {message.suffix ? ` · ${message.suffix}` : ""}
                  </p>
                  <RegisterButton
                    programSlug={program.slug}
                    classId={item.id}
                    intent={intent}
                    className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-5 text-[13.5px] font-semibold transition-all hover:-translate-y-0.5 ${ctaStyles[status]}`}
                  >
                    {ctaLabel[intent].long}
                    <ArrowRight aria-hidden className="size-4" />
                  </RegisterButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Row({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand-teal-soft text-brand-teal-dark">
        <Icon aria-hidden className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11.5px] text-ink-soft">{label}</dt>
        <dd className="font-semibold text-ink">{value}</dd>
      </div>
    </div>
  );
}
