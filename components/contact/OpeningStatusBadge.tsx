"use client";

import { getOpeningStatus } from "@/lib/opening-hours";
import { useNow } from "@/lib/use-now";

type OpeningStatusBadgeProps = {
  generatedAt: number;
  /** "dark" untuk di atas latar teal, "light" untuk di atas kartu putih. */
  tone?: "dark" | "light";
  className?: string;
};

/** Status admin (buka/tutup) yang dihitung live dari jam operasional WIB. */
export function OpeningStatusBadge({ generatedAt, tone = "light", className = "" }: OpeningStatusBadgeProps) {
  const now = useNow(generatedAt);
  const status = getOpeningStatus(now);

  const base =
    tone === "dark"
      ? "bg-white/12 text-white ring-1 ring-white/25 backdrop-blur"
      : "bg-background text-ink ring-1 ring-line";

  return (
    <p role="status" className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${base} ${className}`}>
      <span
        aria-hidden
        className={`status-dot ${status.open ? "status-dot--live text-[#3ddc84]" : "text-brand-yellow"}`}
      />
      <span>
        {status.open ? "Admin online" : "Admin sedang offline"}
        <span className={`font-normal ${tone === "dark" ? "text-white/80" : "text-ink-soft"}`}> · {status.detail}</span>
      </span>
    </p>
  );
}
