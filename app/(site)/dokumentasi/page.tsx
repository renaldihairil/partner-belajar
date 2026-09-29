import { Camera, MessageCircle } from "lucide-react";
import { GalleryExplorer } from "@/components/documentation/GalleryExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { getDocumentation } from "@/lib/documentation-service";
import { youtubeEmbedUrl, youtubeThumbnail } from "@/lib/youtube";
import { absoluteUrl } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";
import { getProgramsWithClasses } from "@/lib/programs-service";
import { whatsappUrl } from "@/lib/whatsapp";

const description = "Video momen belajar para siswa Partner Belajar — di kelas online, tatap muka, dan kegiatan spesial.";

export const metadata = pageMetadata({
  title: "Dokumentasi Belajar — Partner Belajar",
  description,
  path: "/dokumentasi",
});

export default async function DokumentasiPage() {
  const [programs, sorted] = await Promise.all([getProgramsWithClasses(), getDocumentation()]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": sorted.map((item) => ({
      "@type": "VideoObject",
      name: item.title,
      description: item.caption,
      thumbnailUrl: youtubeThumbnail(item.youtubeId),
      uploadDate: item.date,
      embedUrl: youtubeEmbedUrl(item.youtubeId),
      contentUrl: `https://youtu.be/${item.youtubeId}`,
      inLanguage: "id-ID",
      isPartOf: { "@type": "WebPage", "@id": absoluteUrl("/dokumentasi") },
    })),
  };

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
              Kirimkan videonya via WhatsApp. Kami hanya menampilkan video dengan izin orang tua.
            </p>
          </div>
        </div>
        <a
          href={whatsappUrl("Assalamu'alaikum Admin Partner Belajar, saya ingin berbagi video momen belajar anak saya.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#1faf55] px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
        >
          <MessageCircle aria-hidden className="size-4" />
          Kirim Video
        </a>
      </aside>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
