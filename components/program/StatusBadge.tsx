import { statusLabel } from "@/lib/class-status";
import type { RegistrationStatus } from "@/types";

const styles: Record<RegistrationStatus, string> = {
  open: "text-status-open",
  upcoming: "text-status-upcoming",
  full: "text-status-full",
  closed: "text-status-closed",
};

export function StatusBadge({ status, className = "" }: { status: RegistrationStatus; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/80 bg-surface/90 px-3 py-1 text-[12px] font-semibold text-ink shadow-soft backdrop-blur ${className}`}
    >
      <span className={`status-dot ${status === "open" ? "status-dot--live" : ""} ${styles[status]}`} aria-hidden />
      {statusLabel[status]}
    </span>
  );
}
