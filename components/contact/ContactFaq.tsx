import { ChevronDown, HelpCircle } from "lucide-react";
import type { Faq } from "@/data/faqs";

/** Accordion FAQ memakai <details> native — dapat diakses keyboard tanpa JavaScript. */
export function ContactFaq({ items }: { items: Faq[] }) {
  return (
    <section aria-labelledby="faq-title" className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-soft md:p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-brand-teal-soft text-brand-teal-dark">
          <HelpCircle aria-hidden className="size-5" />
        </span>
        <h2 id="faq-title" className="text-lg font-bold text-ink">
          Pertanyaan yang sering diajukan
        </h2>
      </div>
      <div className="mt-4 divide-y divide-line">
        {items.map((faq, index) => (
          <details key={faq.question} className="faq-item group py-1" open={index === 0}>
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-xl py-2 text-[14.5px] font-semibold text-ink transition-colors hover:text-brand-teal-dark">
              {faq.question}
              <ChevronDown aria-hidden className="faq-chevron size-5 shrink-0 text-brand-teal transition-[rotate] duration-300" />
            </summary>
            <p className="faq-body pb-3 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
