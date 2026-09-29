import { FeatureCard } from "@/components/home/FeatureCard";
import { HomeHero } from "@/components/home/HomeHero";
import { StatsSection } from "@/components/home/StatsSection";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { features } from "@/data/features";
import { reasons } from "@/data/reasons";
import { stats } from "@/data/stats";
import { pageMetadata } from "@/lib/metadata";
import { getProgramsWithClasses, getTestimonials } from "@/lib/programs-service";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Partner Belajar — Bersama Tumbuh, Raih Masa Depan",
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const [programs, testimonials] = await Promise.all([getProgramsWithClasses(), getTestimonials()]);
  return (
    <>
      <HomeHero programCount={programs.length} />
      <section aria-label="Keunggulan Partner Belajar" className="mt-6 md:mt-5">
        <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} {...feature} delayMs={60 + index * 40} />
          ))}
        </ul>
      </section>
      <WhyChooseUs items={reasons} />
      <StatsSection items={stats} />
      <Testimonials items={testimonials} />
    </>
  );
}
