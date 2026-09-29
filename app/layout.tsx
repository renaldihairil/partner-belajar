import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { themeInitScript } from "@/lib/theme";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Bersama Tumbuh, Raih Masa Depan`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  // Izinkan pratinjau gambar besar & cuplikan panjang di hasil Google (termasuk Discover).
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: { types: { "application/rss+xml": [{ url: "/artikel/feed.xml", title: `Artikel ${siteConfig.name}` }] } },
};

/** Data terstruktur situs: organisasi + situs (sekali, di semua halaman). */
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${absoluteUrl("/")}#organisasi`,
      name: siteConfig.name,
      url: absoluteUrl("/"),
      description: siteConfig.description,
      logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo.src), width: siteConfig.logo.width, height: siteConfig.logo.height },
      image: absoluteUrl(siteConfig.ogImage),
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
    },
    {
      "@type": "WebSite",
      "@id": `${absoluteUrl("/")}#situs`,
      url: absoluteUrl("/"),
      name: siteConfig.name,
      inLanguage: "id-ID",
      publisher: { "@id": `${absoluteUrl("/")}#organisasi` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: absoluteUrl("/artikel?q={search_term_string}") },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#10908a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: atribut data-theme diisi skrip sebelum React hydrate.
    <html lang="id" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
