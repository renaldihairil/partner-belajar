import type { ProgramClass, RegistrationStatus } from "@/types";

/**
 * Status pendaftaran sebuah kelas. Kelas Partner Belajar dibuka setiap hari (tanpa periode
 * pendaftaran), jadi status hanya ditentukan oleh:
 * - ditutup sementara oleh admin  → "closed"
 * - kuota terisi penuh            → "full" (kuota 0 = tanpa batas, tidak pernah penuh)
 * - selain itu                    → "open"
 */
export function getClassStatus(item: ProgramClass): RegistrationStatus {
  if (item.manuallyClosed) return "closed";
  if (item.quota > 0 && item.enrolled >= item.quota) return "full";
  return "open";
}

/** Sisa kursi, atau null bila kuota tidak dibatasi. */
export function seatsLeft(item: ProgramClass): number | null {
  if (item.quota <= 0) return null;
  return Math.max(0, item.quota - item.enrolled);
}

const STATUS_PRIORITY: Record<RegistrationStatus, number> = { open: 0, full: 1, closed: 2 };

/** Kelas yang paling relevan untuk kartu: yang sedang dibuka lebih dulu, lalu penuh, lalu ditutup. */
export function pickFeaturedClass(classes: ProgramClass[]) {
  const ranked = classes
    .map((item, index) => ({ item, status: getClassStatus(item), index }))
    .sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] || a.index - b.index);
  return ranked[0] ?? null;
}

/** Urutkan semua kelas untuk panel jadwal (urutan input admin dipertahankan dalam status yang sama). */
export function sortClasses(classes: ProgramClass[]) {
  return classes
    .map((item, index) => ({ item, status: getClassStatus(item), index }))
    .sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] || a.index - b.index);
}

export const statusLabel: Record<RegistrationStatus, string> = {
  open: "Pendaftaran dibuka",
  full: "Kuota penuh",
  closed: "Sementara ditutup",
};

export const modeLabel: Record<ProgramClass["mode"], string> = {
  online: "Online",
  offline: "Tatap muka",
  hybrid: "Hybrid",
};
