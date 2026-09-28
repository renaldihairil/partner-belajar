import type { ProgramClass, RegistrationStatus } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;
/** Semua tanggal jadwal dianggap WIB (UTC+7). */
const WIB_OFFSET = "+07:00";

/** Awal hari (00:00 WIB) untuk tanggal ISO "YYYY-MM-DD". */
export function startOfDayWib(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00${WIB_OFFSET}`).getTime();
}

/** Akhir hari (23:59:59 WIB) — pendaftaran masih dibuka sepanjang hari tanggal tutup. */
export function endOfDayWib(isoDate: string): number {
  return new Date(`${isoDate}T23:59:59${WIB_OFFSET}`).getTime();
}

export function getClassStatus(item: ProgramClass, now: number): RegistrationStatus {
  if (item.manuallyClosed) return "closed";
  if (now < startOfDayWib(item.registrationOpens)) return "upcoming";
  if (now > endOfDayWib(item.registrationCloses)) return "closed";
  if (item.enrolled >= item.quota) return "full";
  return "open";
}

export function seatsLeft(item: ProgramClass): number {
  return Math.max(0, item.quota - item.enrolled);
}

/** Selisih hari kalender (dibulatkan ke atas) dari `now` ke `target`. */
export function daysUntil(target: number, now: number): number {
  return Math.max(0, Math.ceil((target - now) / DAY_MS));
}

const STATUS_PRIORITY: Record<RegistrationStatus, number> = { open: 0, upcoming: 1, full: 2, closed: 3 };

/**
 * Kelas yang paling relevan untuk ditampilkan di kartu:
 * yang sedang buka → yang akan dibuka paling dekat → penuh → ditutup (paling baru).
 */
export function pickFeaturedClass(classes: ProgramClass[], now: number) {
  const ranked = classes
    .map((item) => ({ item, status: getClassStatus(item, now) }))
    .sort((a, b) => {
      const byStatus = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
      if (byStatus !== 0) return byStatus;
      const aStart = startOfDayWib(a.item.classStarts);
      const bStart = startOfDayWib(b.item.classStarts);
      // Ditutup: tampilkan yang terbaru; lainnya: yang paling dekat.
      return a.status === "closed" ? bStart - aStart : aStart - bStart;
    });
  return ranked[0] ?? null;
}

/** Urutkan semua kelas untuk ditampilkan di panel jadwal. */
export function sortClasses(classes: ProgramClass[], now: number) {
  return classes
    .map((item) => ({ item, status: getClassStatus(item, now) }))
    .sort(
      (a, b) =>
        STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] ||
        startOfDayWib(a.item.classStarts) - startOfDayWib(b.item.classStarts),
    );
}

export const statusLabel: Record<RegistrationStatus, string> = {
  open: "Pendaftaran dibuka",
  upcoming: "Segera dibuka",
  full: "Kuota penuh",
  closed: "Pendaftaran ditutup",
};

export const modeLabel: Record<ProgramClass["mode"], string> = {
  online: "Online",
  offline: "Tatap muka",
  hybrid: "Hybrid",
};
