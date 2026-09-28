import { Suspense } from "react";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactFaq } from "@/components/contact/ContactFaq";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { ProgramShortcuts } from "@/components/contact/ProgramShortcuts";
import { Reveal } from "@/components/ui/Reveal";
import { faqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/metadata";
import { getProgramsWithClasses } from "@/lib/programs-service";

export const metadata = pageMetadata({
  title: "Contact — Partner Belajar",
  description: "Kami siap membantu Anda. Hubungi Partner Belajar melalui WhatsApp, email, atau formulir pesan.",
  path: "/contact",
});

// Status "Admin online" di HTML diperbarui berkala; di browser dihitung ulang setiap menit.
export const revalidate = 3600;

export default async function ContactPage() {
  const programs = await getProgramsWithClasses();
  const generatedAt = Date.now();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <ContactHero generatedAt={generatedAt} />
      <ContactChannels generatedAt={generatedAt} />

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-soft md:p-8">
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={100}>
            <ContactFaq items={faqs} />
          </Reveal>
          <Reveal delay={180}>
            <ProgramShortcuts programs={programs} />
          </Reveal>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
