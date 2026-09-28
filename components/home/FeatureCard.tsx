import { BookOpenText, FileText, ShieldCheck, UsersRound, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Feature } from "@/types";

const icons: Record<Feature["icon"], LucideIcon> = {
  program: BookOpenText,
  artikel: FileText,
  pengajar: UsersRound,
  orangtua: ShieldCheck,
};

const iconColor: Record<Feature["tone"], string> = {
  teal: "text-brand-teal",
  yellow: "text-brand-yellow-dark",
  blue: "text-brand-teal",
  green: "text-brand-teal",
};

export function FeatureCard({ title, description, icon, tone, delayMs = 0 }: Feature & { delayMs?: number }) {
  const Icon = icons[icon];
  return (
    <Card
      as="li"
      tone={tone}
      interactive
      style={{ animationDelay: `${delayMs}ms` }}
      className="animate-rise flex flex-col items-center px-4 py-5 text-center md:py-6">
      <Icon aria-hidden className={`size-9 ${iconColor[tone]}`} strokeWidth={1.8} fill="currentColor" fillOpacity={0.2} />
      <h2 className="mt-3 text-[15px] leading-snug font-semibold text-ink">{title}</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{description}</p>
    </Card>
  );
}
