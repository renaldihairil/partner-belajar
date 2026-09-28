import { siteConfig } from "@/lib/site-config";

const DAY_NAMES = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const WIB_OFFSET_MIN = 7 * 60;

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatHHMM(hhmm: string) {
  return hhmm.replace(":", ".");
}

export type OpeningStatus = {
  open: boolean;
  /** Mis. "Sedang buka · tutup 17.00 WIB" atau "Buka lagi Senin 08.00 WIB". */
  detail: string;
};

/** Status buka/tutup admin berdasarkan jam WIB, independen dari zona waktu pengunjung. */
export function getOpeningStatus(now: number, hours = siteConfig.contact.openingHours): OpeningStatus {
  const wib = new Date(now + WIB_OFFSET_MIN * 60_000);
  const day = wib.getUTCDay();
  const minutes = wib.getUTCHours() * 60 + wib.getUTCMinutes();
  const openMin = toMinutes(hours.open);
  const closeMin = toMinutes(hours.close);
  const days: readonly number[] = hours.days;

  if (days.includes(day) && minutes >= openMin && minutes < closeMin) {
    return { open: true, detail: `Sedang buka · tutup ${formatHHMM(hours.close)} WIB` };
  }

  // Cari hari buka berikutnya (hari ini bila belum jam buka).
  for (let offset = 0; offset < 8; offset++) {
    const candidate = (day + offset) % 7;
    if (!days.includes(candidate)) continue;
    if (offset === 0 && minutes >= openMin) continue;
    const when = offset === 0 ? "hari ini" : offset === 1 ? "besok" : DAY_NAMES[candidate];
    return { open: false, detail: `Buka lagi ${when} ${formatHHMM(hours.open)} WIB` };
  }
  return { open: false, detail: "Di luar jam operasional" };
}
