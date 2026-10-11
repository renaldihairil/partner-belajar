import type { Testimonial } from "@/types";

export const avatarTone: Record<Testimonial["tone"], string> = {
  teal: "bg-brand-teal-soft text-brand-teal-dark",
  yellow: "bg-brand-yellow-soft text-warn",
  blue: "bg-soft-blue text-brand-teal-dark",
  green: "bg-soft-green text-brand-teal-dark",
  purple: "bg-soft-purple text-accent-purple-ink",
};

/** "Ibu Siti Aminah" → "SA" (sapaan di depan nama diabaikan). */
export function initials(name: string) {
  const words = name.replace(/^(Ibu|Bapak|Bpk\.?|Bu|Pak)\s+/i, "").split(/\s+/);
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
