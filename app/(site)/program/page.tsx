import { ProgramExplorer } from "@/components/program/ProgramExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { getProgramsWithClasses } from "@/lib/programs-service";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

const description = "Pilih program belajar terbaik untuk mendukung perkembangan anak sesuai kebutuhan.";

export const metadata = pageMetadata({
  title: "Program Belajar — Partner Belajar",
  description,
  path: "/program",
});

export default async function ProgramPage() {
  const programs = await getProgramsWithClasses();

  // Data terstruktur (schema.org) untuk mesin pencari.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: programs.map((program, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: program.title,
        description: program.description,
        url: absoluteUrl(`/program/${program.slug}`),
        provider: { "@type": "Organization", name: siteConfig.name, sameAs: siteConfig.url },
        hasCourseInstance: program.classes.map((item) => ({
          "@type": "CourseInstance",
          name: item.name,
          courseMode: item.mode === "offline" ? "onsite" : item.mode === "hybrid" ? "blended" : "online",
          description: `Dibuka setiap hari. Jadwal: ${item.days.join(", ")}, ${item.time}`,
          ...(item.location ? { location: item.location } : {}),
        })),
      },
    })),
  };

  return (
    <>
      <PageHeader title="Program" description={description} />
      <ProgramExplorer programs={programs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }}
      />
    </>
  );
}
