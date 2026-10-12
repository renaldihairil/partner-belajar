import Image from "next/image";
import { Download, Library } from "lucide-react";
import type { LearningModule, Program } from "@/types";

type ModuleCardProps = {
  module: LearningModule;
  program?: Program;
  /** Gambar di atas lipatan dimuat segera; sisanya malas. */
  priority?: boolean;
};

/** Kartu satu kitab: sampul 1:1, nama kitab, deskripsi singkat, dan tombol download (tautan ke halaman lain). */
export function ModuleCard({ module, program, priority }: ModuleCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-clip rounded-[28px] border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div className={`program-surface theme-${program?.theme ?? "green"} relative aspect-square w-full overflow-clip`}>
        {module.cover ? (
          <Image
            src={module.cover}
            alt={`Sampul ${module.title}`}
            fill
            sizes="(min-width: 1536px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <>
            <div aria-hidden className="hero-dots absolute inset-0" />
            <span aria-hidden className="absolute inset-0 grid place-items-center">
              <Library className="size-20 text-brand-teal-dark/60" strokeWidth={1.4} />
            </span>
          </>
        )}
        {program && (
          <span className="absolute top-3 left-3 rounded-full bg-panel px-2.5 py-1 text-[11.5px] font-semibold text-ink backdrop-blur">
            {program.title}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="flex-1 text-lg leading-snug font-bold text-ink">{module.title}</h2>
        <a
          href={module.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Download ${module.title} (membuka halaman lain)`}
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-teal-strong px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-teal-dark"
        >
          <Download aria-hidden className="size-4" />
          Download
        </a>
      </div>
    </article>
  );
}
