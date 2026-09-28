import type { ReactNode } from "react";
import { LeafCloud } from "./Decor";

type PageHeaderProps = {
  title: string;
  description: ReactNode;
  /** Latar mobile untuk header (mis. Artikel memakai krem di referensi mobile). */
  mobileTone?: "none" | "yellow";
};

export function PageHeader({ title, description, mobileTone = "none" }: PageHeaderProps) {
  return (
    <header
      className={`animate-rise relative -mx-5 mb-6 overflow-hidden px-5 pt-4 pb-6 md:mx-0 md:mb-8 md:overflow-visible md:bg-transparent md:px-0 md:pt-2 md:pb-0 ${
        mobileTone === "yellow" ? "rounded-b-[32px] bg-brand-yellow-soft" : ""
      }`}
    >
      <LeafCloud
        className={`pointer-events-none absolute -top-2 -right-6 w-36 md:top-0 md:right-2 md:w-44 ${
          mobileTone === "yellow" ? "text-brand-yellow/30 md:text-brand-teal-soft" : "text-brand-teal-soft"
        }`}
      />
      <div className="relative max-w-2xl">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-ink md:text-5xl">{title}</h1>
        <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-soft md:max-w-[60ch] md:text-base">
          {description}
        </p>
      </div>
    </header>
  );
}
