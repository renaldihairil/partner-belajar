import type { ReactNode } from "react";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({ id, eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-[13px] font-semibold tracking-wide text-brand-teal uppercase">{eyebrow}</p>
      )}
      <h2 id={id} className="mt-1.5 text-[26px] leading-tight font-bold tracking-tight text-ink md:text-[34px]">
        {title}
      </h2>
      {description && <p className="mt-2 text-[15px] leading-relaxed text-ink-soft md:text-base">{description}</p>}
    </div>
  );
}
