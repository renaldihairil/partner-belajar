import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ClipboardList, LinkIcon, LockKeyhole } from "lucide-react";
import { CharacterIllustration } from "@/components/character/CharacterIllustration";
import { TeacherPinGate } from "@/components/teachers/TeacherPinGate";
import { TeacherSubmitForm } from "@/components/teachers/TeacherSubmitForm";
import { Logo } from "@/components/ui/Logo";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { getDb, schema } from "@/db";
import { getTeacherFormAccess } from "@/lib/teacher-form";

// PIN, status link, dan sesi harus selalu dicek ulang pada setiap kunjungan — jangan di-cache.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Form Data Pengajar",
  description: "Lengkapi data pengajar Partner Belajar.",
  // Link ini dibagikan khusus ke pengajar, bukan untuk hasil pencarian.
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ token: string }> };

export default async function TeacherFormPage({ params }: PageProps) {
  const { token } = await params;
  const { link, unlocked } = await getTeacherFormAccess(token);
  if (!link) notFound();

  // Daftar program hanya diambil setelah PIN benar.
  let programs: { id: string; title: string }[] = [];
  if (unlocked) {
    const db = await getDb().catch(() => null);
    if (db) {
      programs = await db
        .select({ id: schema.programs.id, title: schema.programs.title })
        .from(schema.programs)
        .where(eq(schema.programs.published, true))
        .orderBy(asc(schema.programs.sortOrder));
    }
  }

  return (
    <main className="relative isolate min-h-dvh overflow-clip px-4 pt-6 pb-12 md:pt-10">
      <PageBackdrop />
      <div className="mx-auto w-full max-w-xl">
        <header className="animate-rise flex flex-col items-center text-center">
          <Logo className="w-[132px]" priority />
          {link.active && (
            <>
              <CharacterIllustration
                src="/characters/contact-admin.webp"
                alt=""
                width={1100}
                height={834}
                sizes="170px"
                priority
                float
                className="mt-5 w-[120px] md:w-[150px]"
              />
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-teal/15 bg-surface/80 px-3.5 py-1.5 text-[13px] font-medium text-ink shadow-soft backdrop-blur">
                {unlocked ? (
                  <ClipboardList aria-hidden className="size-4 text-brand-teal" />
                ) : (
                  <LockKeyhole aria-hidden className="size-4 text-brand-teal" />
                )}
                Khusus pengajar
              </p>
              <h1 className="mt-3 text-[28px] leading-tight font-extrabold tracking-tight text-ink md:text-[34px]">
                {unlocked ? "Lengkapi data pengajar" : "Form data pengajar"}
              </h1>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">
                {unlocked
                  ? "Isi data berikut agar profil Anda bisa kami tampilkan di website Partner Belajar."
                  : "Masukkan PIN dari admin untuk membuka form."}
              </p>
            </>
          )}
        </header>

        <section
          aria-label={!link.active ? "Link tidak aktif" : unlocked ? "Formulir data pengajar" : "Masukkan PIN"}
          className="animate-rise mt-7 rounded-[28px] border border-line bg-surface/95 p-5 shadow-lift backdrop-blur md:p-8"
          style={{ animationDelay: "80ms" }}
        >
          {!link.active ? (
            <div className="flex flex-col items-center px-2 py-8 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-brand-yellow-soft text-warn">
                <LinkIcon aria-hidden className="size-8" />
              </span>
              <h1 className="mt-4 text-xl font-extrabold text-ink">Link ini sudah tidak aktif</h1>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                Pengisian data lewat link ini sudah ditutup. Silakan hubungi admin Partner Belajar untuk mendapatkan link yang baru.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-teal-strong px-6 text-[15px] font-semibold text-white transition-all hover:brightness-110"
              >
                Hubungi admin
              </Link>
            </div>
          ) : unlocked ? (
            <TeacherSubmitForm token={token} programs={programs} />
          ) : (
            <TeacherPinGate token={token} />
          )}
        </section>

        <p className="mt-6 text-center text-sm text-ink-soft">
          <Link href="/" className="font-semibold text-brand-teal-dark hover:underline">
            Kunjungi website Partner Belajar
          </Link>
        </p>
      </div>
    </main>
  );
}
