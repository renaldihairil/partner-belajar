import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { RegistrationProvider } from "@/components/registration/RegistrationProvider";
import { getProgramsWithClasses } from "@/lib/programs-service";
import { themeInitScript } from "@/lib/theme";
import { siteConfig } from "@/lib/site-config";
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
};

export const viewport: Viewport = {
  themeColor: "#10908a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const programs = await getProgramsWithClasses();
  return (
    // suppressHydrationWarning: atribut data-theme diisi skrip sebelum React hydrate.
    <html lang="id" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <RegistrationProvider programs={programs}>
          <AppShell>{children}</AppShell>
        </RegistrationProvider>
      </body>
    </html>
  );
}
