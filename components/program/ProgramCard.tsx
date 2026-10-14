import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarCheck, Info, ListChecks } from "lucide-react";
import { RegisterButton } from "@/components/registration/RegisterButton";
import { seatsLeft } from "@/lib/class-status";
import type { ProgramClass, ProgramWithClasses, RegistrationStatus } from "@/types";

/** Kalimat ringkas status pendaftaran sebuah kelas (dipakai panel jadwal di halaman detail program). */
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

/**
 * Kartu program di halaman Program: ilustrasi, nama, deskripsi singkat, lalu dua tombol —
 * "Daftar Sekarang" (formulir WhatsApp) dan "Detail". Jadwal & status ada di halaman detail.
 */
export function ProgramCard({ program, priority }: ProgramCardProps) {
  const href = `/program/${program.slug}`;
  const titleId = `program-${program.slug}`;

  return (
    <article
      aria-labelledby={titleId}
      className={`program-card theme-${program.theme} group flex h-full flex-col lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-0`}
    >
      {/* Baris 1: visual + judul (tinggi disamakan antar kartu sebaris lewat subgrid) */}
      {/* Layar lebar (3 kolom): visual di atas, teks di bawah. Layar lebih kecil: visual di kiri, teks di kanan. */}
      <div className="grid grid-cols-[40%_1fr] sm:grid-cols-[42%_1fr] xl:grid-cols-1">
        <div className="relative flex min-h-[200px] items-end justify-center pt-8 sm:min-h-[236px] xl:min-h-[250px]">
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

        <div className="flex flex-col py-5 pr-4 pl-1 sm:py-6 sm:pr-6 xl:px-6 xl:pt-3 xl:pb-9">
          <p className="text-[11.5px] font-semibold tracking-wide text-ink-soft uppercase">
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

      {/* Baris 2: tombol aksi */}
      <div className="relative z-[2] mx-3 -mt-5 mb-3 grid grid-cols-[1fr_auto] gap-2 rounded-[22px] bg-panel p-3 ring-1 ring-[var(--pc-border)] backdrop-blur-md sm:p-4">
        <RegisterButton
          programSlug={program.slug}
          intent="daftar"
          className="inline-flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-full bg-brand-teal-strong px-4 text-[14px] font-semibold whitespace-nowrap text-white shadow-[0_10px_20px_-12px_rgb(14_127_122/0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
        >
          Daftar Sekarang
          <ArrowRight aria-hidden className="size-4 shrink-0" />
        </RegisterButton>
        <Link
          href={href}
          className="inline-flex min-h-12 items-center justify-center gap-1 rounded-full bg-panel px-4 text-[14px] font-semibold whitespace-nowrap text-brand-teal-dark ring-1 ring-brand-teal/30 transition-colors hover:bg-brand-teal-soft"
        >
          Detail
          <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only">{program.title}</span>
        </Link>
      </div>
    </article>
  );
}
