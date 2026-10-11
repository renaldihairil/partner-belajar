import { Library, MessageCircle } from "lucide-react";
import { ModuleExplorer } from "@/components/modules/ModuleExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { getLearningModules } from "@/lib/modules-service";
import { getProgramsWithClasses } from "@/lib/programs-service";
import { absoluteUrl } from "@/lib/site-config";
import { whatsappUrl } from "@/lib/whatsapp";

const description = "Kitab dan buku yang kami pakai untuk belajar di Partner Belajar. Unduh dan pelajari bersama anak di rumah.";

export const metadata = pageMetadata({
  title: "Modul Belajar — Partner Belajar",
  description,
  path: "/modul-belajar",
});

export default async function ModulBelajarPage() {
  const [programs, modules] = await Promise.all([getProgramsWithClasses(), getLearningModules()]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Modul Belajar Partner Belajar",
    url: absoluteUrl("/modul-belajar"),
    itemListElement: modules.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Book",
        name: item.title,
        description: item.description,
        inLanguage: "id-ID",
        ...(item.cover ? { image: item.cover.startsWith("http") ? item.cover : absoluteUrl(item.cover) } : {}),
      },
    })),
  };

  return (
    <>
      <PageHeader title="Modul Belajar" description={description} />

      {modules.length === 0 ? (
        <div className="grid place-items-center gap-3 rounded-[28px] bg-brand-teal-soft px-6 py-14 text-center">
          <Library aria-hidden className="size-10 text-brand-teal-dark" />
          <p className="font-bold text-ink">Modul belajar akan segera tersedia.</p>
          <p className="max-w-md text-sm text-ink-soft">Kami sedang menyiapkan kitab dan buku untuk Anda. Silakan kembali lagi nanti.</p>
        </div>
      ) : (
        <ModuleExplorer modules={modules} programs={programs} />
      )}

      <aside className="mt-10 flex flex-col items-start gap-4 rounded-[24px] border border-dashed border-brand-teal/40 bg-brand-teal-soft p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <p className="font-bold text-ink">Butuh bimbingan memakai modul ini?</p>
          <p className="text-sm text-ink-soft">Tanyakan program yang cocok untuk anak Anda, kami dengan senang hati membantu.</p>
        </div>
        <a
          href={whatsappUrl("Assalamu'alaikum Admin Partner Belajar, saya ingin bertanya tentang modul belajar.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#1faf55] px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
        >
          <MessageCircle aria-hidden className="size-4" />
          Tanya via WhatsApp
        </a>
      </aside>
      {modules.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
    </>
  );
}
