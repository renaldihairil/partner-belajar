const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTHS_ID_LONG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const DAYS_ID = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function parts(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return { year, month, day };
}

/** "2025-09-12" → "12 Sep 2025" (format singkat seperti di referensi desain). */
export function formatDateId(isoDate: string): string {
  const { year, month, day } = parts(isoDate);
  return `${day} ${MONTHS_ID[month - 1]} ${year}`;
}

/** "2026-10-13" → "Selasa, 13 Oktober 2026". */
export function formatDateLongId(isoDate: string): string {
  const { year, month, day } = parts(isoDate);
  const weekday = DAYS_ID[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${weekday}, ${day} ${MONTHS_ID_LONG[month - 1]} ${year}`;
}

/** "2026-10-13" → "13 Okt" (tanpa tahun, untuk teks ringkas). */
export function formatDayMonthId(isoDate: string): string {
  const { month, day } = parts(isoDate);
  return `${day} ${MONTHS_ID[month - 1]}`;
}

const DAY_ABBR: Record<string, string> = {
  Senin: "Sen", Selasa: "Sel", Rabu: "Rab", Kamis: "Kam", Jumat: "Jum", Sabtu: "Sab", Ahad: "Ahad", Minggu: "Min",
};

const WEEK_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"];

/**
 * ["Senin","Rabu"] → "Sen & Rab"; 3+ hari berurutan → "Sen – Kam" (atau "Senin – Kamis").
 */
export function formatDays(days: string[], short = true): string {
  const idx = days.map((d) => WEEK_ORDER.indexOf(d === "Minggu" ? "Ahad" : d));
  const consecutive = idx.length >= 3 && idx.every((v, i) => v >= 0 && (i === 0 || v === idx[i - 1] + 1));
  const label = (d: string) => (short ? (DAY_ABBR[d] ?? d) : d);
  if (consecutive) return `${label(days[0])} – ${label(days[days.length - 1])}`;
  const list = days.map(label);
  if (list.length <= 1) return list.join("");
  return `${list.slice(0, -1).join(", ")} & ${list[list.length - 1]}`;
}
