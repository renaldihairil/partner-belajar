const FALLBACK_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  // Preview deployment di Vercel tanpa NEXT_PUBLIC_SITE_URL tetap punya URL yang valid.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return FALLBACK_SITE_URL;
}

export const siteConfig = {
  name: "Partner Belajar",
  url: resolveSiteUrl(),
  locale: "id_ID",
  description:
    "Program belajar yang dirancang untuk membantu setiap anak mengembangkan potensi terbaiknya.",
  logo: {
    src: "/logo/partner-belajar-logo.png",
    width: 600,
    height: 204,
    alt: "Partner Belajar",
  },
  ogImage: "/og-image.jpg",
  contact: {
    address: ["Jl. Pendidikan No. 123", "Jakarta, Indonesia"],
    phone: "+62 878-2004-7377",
    /** Nomor WhatsApp tujuan pendaftaran (format internasional tanpa + dan spasi). */
    whatsapp: "6287820047377",
    email: "halo@partnerbelajar.id",
    hours: ["Senin – Jumat", "08.00 – 17.00 WIB"],
    /**
     * Jam operasional terstruktur (WIB) untuk status "Sedang buka" yang dihitung otomatis.
     * days: 0 = Ahad, 1 = Senin, …, 6 = Sabtu. Samakan dengan `hours` di atas.
     */
    openingHours: { days: [1, 2, 3, 4, 5], open: "08:00", close: "17:00" },
  },
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}
