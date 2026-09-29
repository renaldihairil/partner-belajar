import { MessageCircle, PenLine } from "lucide-react";
import { RatingSummary } from "@/components/testimonials/RatingSummary";
import { TestimonialsExplorer } from "@/components/testimonials/TestimonialsExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/metadata";
import { getProgramsWithClasses, getTestimonials } from "@/lib/programs-service";
import { whatsappUrl } from "@/lib/whatsapp";

const description = "Cerita dan pengalaman para orang tua yang anaknya belajar bersama Partner Belajar.";

export const metadata = pageMetadata({
  title: "Testimoni Orang Tua — Partner Belajar",
  description,
  path: "/testimoni",
});

export default async function TestimoniPage() {
  const [programs, testimonials] = await Promise.all([getProgramsWithClasses(), getTestimonials()]);
  const sorted = [...testimonials].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <>
      <PageHeader title="Testimoni" description={description} />

      <Reveal>
        <RatingSummary items={testimonials} />
      </Reveal>

      <TestimonialsExplorer items={sorted} programs={programs} />

      <Reveal className="mt-10">
        <section
          aria-labelledby="bagikan-title"
          className="stats-band relative isolate flex flex-col items-start gap-4 overflow-clip rounded-[28px] p-6 text-white md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div aria-hidden className="stats-dots absolute inset-0 -z-10" />
          <div className="flex items-start gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-yellow text-on-accent">
              <PenLine aria-hidden className="size-6" />
            </span>
            <div>
              <h2 id="bagikan-title" className="text-xl font-extrabold md:text-2xl">
                Bagikan pengalaman Anda
              </h2>
              <p className="mt-1 text-sm text-white/85 md:text-base">
                Cerita Anda membantu orang tua lain menemukan pendamping belajar yang tepat.
              </p>
            </div>
          </div>
          <a
            href={whatsappUrl("Assalamu'alaikum Admin Partner Belajar, saya ingin memberikan testimoni:\n\nNama:\nProgram anak:\nCerita:")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-brand-yellow px-6 text-[15px] font-bold text-on-accent transition-all hover:-translate-y-0.5 hover:bg-[#fac93f]"
          >
            <MessageCircle aria-hidden className="size-5" />
            Tulis Testimoni
          </a>
        </section>
      </Reveal>
    </>
  );
}
