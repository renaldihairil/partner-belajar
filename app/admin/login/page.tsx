import type { Metadata } from "next";
import { sql } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { getDb } from "@/db";
import { getCurrentAdmin } from "@/lib/auth/session";
import { sessionSecret } from "@/lib/auth/token";

export const metadata: Metadata = { title: "Masuk" };

type PageProps = { searchParams: Promise<{ next?: string }> };

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const db = await getDb().catch(() => null);
  if (db && (await getCurrentAdmin())) redirect("/admin");

  // Bangunkan database (Neon gratis "tidur" saat sepi) selagi admin mengetik password,
  // agar halaman pertama setelah login tidak menunggu lama.
  if (db) after(() => db.execute(sql`select 1`).catch(() => undefined));

  const problems = [
    !db && "Database belum terhubung — hubungkan Neon di Vercel (menu Storage), lalu deploy ulang.",
    !sessionSecret() && "AUTH_SECRET belum diatur di Environment Variables (minimal 32 karakter acak).",
  ].filter(Boolean) as string[];

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <section className="stats-band relative isolate hidden flex-col justify-between overflow-clip p-10 text-white lg:flex">
        <div aria-hidden className="stats-dots absolute inset-0 -z-10" />
        <div className="flex items-center gap-3">
          <Image src="/icons/icon-192.png" alt="" width={40} height={40} className="size-10 rounded-2xl bg-white/95 p-1" />
          <span className="text-lg font-semibold">Partner Belajar</span>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <Image src="/characters/hero-kids.webp" alt="" width={520} height={520} priority className="h-auto w-full drop-shadow-2xl" />
        </div>
        <div>
          <p className="text-2xl leading-snug font-semibold">Kelola program, jadwal kelas, pengajar, dan testimoni dari satu tempat.</p>
          <p className="mt-2 text-sm text-white/75">Setiap perubahan langsung tampil di partnerbelajar.vercel.app</p>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <Logo className="w-[140px] lg:hidden" priority />
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-brand-teal-soft px-2 py-1 text-xs font-medium text-brand-teal-dark lg:mt-0">
              <ShieldCheck aria-hidden className="size-3.5" />
              Admin Panel
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Masuk ke admin</h1>
            <p className="mt-1 text-sm text-ink-soft">Gunakan email dan password admin Anda.</p>
          </div>
          {problems.length > 0 ? (
            <ul className="grid gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
              {problems.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          ) : (
            <LoginForm next={next} />
          )}
          <p className="mt-8 text-center text-xs text-ink-soft lg:text-left">
            Bukan admin?{" "}
            <Link href="/" className="font-medium text-brand-teal-dark hover:underline">
              Kembali ke situs
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
