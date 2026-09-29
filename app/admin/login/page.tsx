import type { Metadata } from "next";
import { redirect } from "next/navigation";
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

  const problems = [
    !db && "Database belum terhubung — hubungkan Neon di Vercel (menu Storage), lalu deploy ulang.",
    !sessionSecret() && "AUTH_SECRET belum diatur di Environment Variables (minimal 32 karakter acak).",
  ].filter(Boolean) as string[];

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo className="w-[150px]" priority />
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-teal-soft px-3 py-1 text-xs font-semibold text-brand-teal-dark">
            <ShieldCheck aria-hidden className="size-3.5" />
            Admin Panel
          </p>
        </div>
        <div className="rounded-[26px] border border-line bg-surface p-6 shadow-soft">
          <h1 className="text-xl font-bold text-ink">Masuk ke admin</h1>
          <p className="mt-1 mb-5 text-sm text-ink-soft">Kelola program, jadwal kelas, pengajar, dan testimoni.</p>
          {problems.length > 0 ? (
            <ul className="grid gap-2 rounded-xl bg-brand-yellow-soft p-4 text-sm text-ink">
              {problems.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          ) : (
            <LoginForm next={next} />
          )}
        </div>
      </div>
    </main>
  );
}
