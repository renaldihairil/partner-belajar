import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin Partner Belajar" },
  robots: { index: false, follow: false },
};

// Halaman admin selalu dirender per permintaan (data terbaru, butuh sesi login).
export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-dvh bg-background">{children}</div>;
}
