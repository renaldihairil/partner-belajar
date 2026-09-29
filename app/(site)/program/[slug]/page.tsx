import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudienceSection } from "@/components/program-detail/AudienceSection";
import { CurriculumSection } from "@/components/program-detail/CurriculumSection";
import { DetailHero } from "@/components/program-detail/DetailHero";
import { FinalCta } from "@/components/program-detail/FinalCta";
import { PricingSection } from "@/components/program-detail/PricingSection";
import { ScheduleSection } from "@/components/program-detail/ScheduleSection";
import { StickyRegisterBar } from "@/components/program-detail/StickyRegisterBar";
import { pageMetadata } from "@/lib/metadata";
import { getProgramsWithClasses } from "@/lib/programs-service";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

type PageProps = { params: Promise<{ slug: string }> };

// Statis + diperbarui berkala (ISR) agar status jadwal di HTML tetap segar.
export const revalidate = 3600;
// Program baru dari admin langsung bisa dibuka tanpa build ulang.
export const dynamicParams = true;

export async function generateStaticParams() {
  const programs = await getProgramsWithClasses();
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = (await getProgramsWithClasses()).find((p) => p.slug === slug);
  if (!program) return {};
  return pageMetadata({
    title: `${program.title} — Program Belajar Partner Belajar`,
    description: `${program.tagline} ${program.description}`,
    path: `/program/${program.slug}`,
  });
}

const sections = [
  { href: "#kurikulum", label: "Kurikulum" },
  { href: "#cocok-untuk", label: "Cocok untuk" },
  { href: "#jadwal", label: "Jadwal" },
  { href: "#harga", label: "Harga" },
];

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const programs = await getProgramsWithClasses();
  const program = programs.find((p) => p.slug === slug);
  if (!program) notFound();

  const generatedAt = Date.now();
  const others = programs.filter((p) => p.slug !== program.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description: program.longDescription,
    url: absoluteUrl(`/program/${program.slug}`),
    provider: { "@type": "Organization", name: siteConfig.name, sameAs: siteConfig.url },
    offers: program.pricing.map((plan) => ({
      "@type": "Offer",
      name: plan.label,
      price: plan.price,
      priceCurrency: "IDR",
      category: plan.unit,
    })),
    hasCourseInstance: program.classes.map((item) => ({
      "@type": "CourseInstance",
      name: item.name,
      courseMode: item.mode === "offline" ? "onsite" : item.mode === "hybrid" ? "blended" : "online",
      startDate: item.classStarts,
      ...(item.location ? { location: item.location } : {}),
    })),
  };

  return (
    <>
      <DetailHero program={program} generatedAt={generatedAt} />

      <nav
        aria-label="Bagian halaman"
        className="sticky top-0 z-20 -mx-5 mt-4 overflow-x-auto border-b border-line bg-surface/90 px-5 py-2.5 backdrop-blur [scrollbar-width:none] md:mx-0 md:rounded-full md:border md:px-3 [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max gap-1.5">
          {sections.map((section) => (
            <li key={section.href}>
              <a
                href={section.href}
                className="inline-flex min-h-9 items-center rounded-full px-4 text-[13.5px] font-semibold text-ink-soft transition-colors hover:bg-brand-teal-soft hover:text-ink"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-12 flex flex-col gap-16 md:mt-14 md:gap-20">
        <CurriculumSection program={program} />
        <AudienceSection program={program} />
        <ScheduleSection program={program} generatedAt={generatedAt} />
        <PricingSection program={program} />
        <FinalCta program={program} others={others} />
      </div>

      <StickyRegisterBar program={program} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
