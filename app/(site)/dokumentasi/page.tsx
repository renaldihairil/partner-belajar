import { Camera, MessageCircle } from "lucide-react";
import { GalleryExplorer } from "@/components/documentation/GalleryExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { documentation } from "@/data/documentation";
import { pageMetadata } from "@/lib/metadata";
import { getProgramsWithClasses } from "@/lib/programs-service";
import { whatsappUrl } from "@/lib/whatsapp";

const description = "Momen belajar para siswa Partner Belajar — di kelas online, tatap muka, dan kegiatan spesial.";

export const metadata = pageMetadata({
  title: "Dokumentasi Belajar — Partner Belajar",
  description,
  path: "/dokumentasi",
});

export default async function DokumentasiPage() {
  const programs = await getProgramsWithClasses();
  const sorted = [...documentation].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader title="Dokumentasi" description={description} mobileTone="yellow" />

      <GalleryExplorer items={sorted} programs={programs} />

      <aside className="mt-10 flex flex-col items-start gap-4 rounded-[24px] border border-dashed border-brand-teal/40 bg-brand-teal-soft p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface text-brand-teal-dark">
            <Camera aria-hidden className="size-5" />
          </span>
          <div>
            <p className="font-bold text-ink">Punya momen belajar anak bersama kami?</p>
            <p className="text-sm text-ink-soft">
              Kirimkan fotonya via WhatsApp. Kami hanya menampilkan foto dengan izin orang tua.
            </p>
          </div>
        </div>
        <a
          href={whatsappUrl("Assalamu'alaikum Admin Partner Belajar, saya ingin berbagi foto momen belajar anak saya.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#1faf55] px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
        >
          <MessageCircle aria-hidden className="size-4" />
          Kirim Foto
        </a>
      </aside>
    </>
  );
}
