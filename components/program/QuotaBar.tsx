import type { CSSProperties } from "react";
import { seatsLeft } from "@/lib/class-status";
import type { ProgramClass, RegistrationStatus } from "@/types";

type QuotaBarProps = {
  item: ProgramClass;
  status: RegistrationStatus;
  compact?: boolean;
};

/** Bar kuota selalu ditampilkan agar tinggi panel info setiap kartu seragam. */
export function QuotaBar({ item, status, compact = false }: QuotaBarProps) {
  const left = seatsLeft(item);
  const ratio = item.quota > 0 ? Math.min(1, item.enrolled / item.quota) : 1;

  const tone =
    status === "closed"
      ? "quota-bar--closed"
      : left === 0
        ? "quota-bar--full"
        : ratio >= 0.7
          ? "quota-bar--warn"
          : "";

  const [leftText, rightText, rightClass] =
    status === "upcoming"
      ? [`Kuota ${item.quota} kursi`, "Belum dibuka", "text-warn"]
      : status === "closed"
        ? [`${item.enrolled}/${item.quota} kursi terisi`, "Ditutup", "text-ink-soft"]
        : left === 0
          ? [`${item.enrolled}/${item.quota} kursi terisi`, "Penuh", "text-status-full"]
          : [`${item.enrolled}/${item.quota} kursi terisi`, `Sisa ${left} kursi`, left <= 3 ? "text-warn" : "text-brand-teal-dark"];

  return (
    <div>
      <div className={`flex items-center justify-between font-medium ${compact ? "text-[11.5px]" : "text-xs"}`}>
        <span className="text-ink-soft">{leftText}</span>
        <span className={rightClass}>{rightText}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Kuota kelas terisi"
        aria-valuemin={0}
        aria-valuemax={item.quota}
        aria-valuenow={item.enrolled}
        className={`quota-bar mt-1.5 h-2 overflow-hidden rounded-full bg-panel ring-1 ring-line ${tone}`}
        style={{ "--fill": `${Math.round(ratio * 100)}%` } as CSSProperties}
      >
        <span />
      </div>
    </div>
  );
}
