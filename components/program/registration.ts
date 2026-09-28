import type { LeadIntent, RegistrationStatus } from "@/types";

export const intentByStatus: Record<RegistrationStatus, LeadIntent> = {
  open: "daftar",
  upcoming: "ingatkan",
  full: "tunggu",
  closed: "info",
};

/** Label CTA versi lengkap (desktop) dan ringkas (mobile). */
export const ctaLabel: Record<LeadIntent, { long: string; short: string }> = {
  daftar: { long: "Daftar Sekarang", short: "Daftar" },
  ingatkan: { long: "Ingatkan Saya", short: "Ingatkan Saya" },
  tunggu: { long: "Masuk Daftar Tunggu", short: "Daftar Tunggu" },
  info: { long: "Tanya Batch Berikutnya", short: "Tanya Batch" },
  tanya: { long: "Tanya via WhatsApp", short: "Tanya" },
};

export const ctaStyles: Record<RegistrationStatus, string> = {
  open: "bg-brand-teal-strong text-white shadow-[0_10px_20px_-12px_rgb(14_127_122/0.9)] hover:brightness-110",
  upcoming: "bg-brand-yellow text-on-accent shadow-[0_10px_20px_-12px_rgb(233_169_0/0.9)] hover:bg-[#fac93f]",
  full: "bg-surface text-ink ring-1 ring-line hover:ring-brand-teal/40",
  closed: "bg-surface text-ink ring-1 ring-line hover:ring-brand-teal/40",
};
