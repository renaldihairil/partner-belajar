import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, LinkIcon, MessageSquareHeart } from "lucide-react";
import { CharacterIllustration } from "@/components/character/CharacterIllustration";
import { SubmitTestimonialForm } from "@/components/testimonials/SubmitTestimonialForm";
import { Logo } from "@/components/ui/Logo";
import { getDb, schema } from "@/db";
import { eq } from "drizzle-orm";

// Status link (aktif / nonaktif) harus selalu dicek ulang, jangan di-cache.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kirim Testimoni",
  description: "Bagikan pengalaman belajar putra-putri Anda bersama Partner Belajar.",
  // Link ini dibagikan khusus ke orang tua, bukan untuk hasil pencarian.
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ token: string }> };

async function loadLink(token: string) {
  const db = await getDb().catch(() => null);
  if (!db) return null;
  const [row] = await db
    .select({
      active: schema.testimonialLinks.active,
      programTitle: schema.programs.title,
    })
    .from(schema.testimonialLinks)
    .leftJoin(schema.programs, eq(schema.programs.id, schema.testimonialLinks.programId))
    .where(eq(schema.testimonialLinks.token, token))
    .limit(1);
  return row ?? null;
}

function Backdrop() {
  return (
    <div aria-hidden className="hero-backdrop absolute inset-0 -z-10">
      <div className="hero-blob hero-blob--yellow" />
      <div className="hero-blob hero-blob--teal" />
      <div className="hero-blob hero-blob--blue" />
      <div className="hero-dots absolute inset-0" />
    </div>
  );
}

export default async function SubmitTestimonialPage({ params }: PageProps) {
  const { token } = await params;
  const link = await loadLink(token);
  if (!link) notFound();

  return (
    <main className="relative isolate min-h-dvh overflow-clip px-4 pt-6 pb-12 md:pt-10">
      <Backdrop />
      <div className="mx-auto w-full max-w-xl">
        <header className="animate-rise flex flex-col items-center text-center">
          <Logo className="w-[132px]" priority />
          {link.active ? (
            <>
              <div className="relative mt-5">
                <CharacterIllustration
                  src="/characters/hero-kids.webp"
                  alt=""
                  width={1200}
                  height={1158}
                  sizes="150px"
                  priority
                  float
                  className="w-[104px] sm:w-[132px] md:w-[150px]"
                />
              </div>
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-teal/15 bg-surface/80 px-3.5 py-1.5 text-[13px] font-medium text-ink shadow-soft backdrop-blur">
                <MessageSquareHeart aria-hidden className="size-4 text-brand-teal" />
                Testimoni orang tua
              </p>
              <h1 className="mt-3 text-[28px] leading-tight font-extrabold tracking-tight text-ink md:text-[34px]">
                Ceritakan pengalaman belajar anak Anda
              </h1>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">
                Cukup 1 menit. Cerita Anda membantu orang tua lain menemukan pendamping belajar yang tepat.
              </p>
              {link.programTitle && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-yellow-soft px-3.5 py-1.5 text-[13px] font-semibold text-warn">
                  <BookOpen aria-hidden className="size-4" />
                  Program {link.programTitle}
                </p>
              )}
            </>
          ) : null}
        </header>

        <section
          aria-label={link.active ? "Formulir testimoni" : "Link tidak aktif"}
          className="animate-rise mt-7 rounded-[28px] border border-line bg-surface/95 p-5 shadow-lift backdrop-blur md:p-8"
          style={{ animationDelay: "80ms" }}
        >
          {link.active ? (
            <SubmitTestimonialForm token={token} />
          ) : (
            <div className="flex flex-col items-center px-2 py-8 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-brand-yellow-soft text-warn">
                <LinkIcon aria-hidden className="size-8" />
              </span>
              <h1 className="mt-4 text-xl font-extrabold text-ink">Link ini sudah tidak aktif</h1>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                Pengumpulan testimoni lewat link ini sudah ditutup. Silakan hubungi admin Partner Belajar untuk mendapatkan link yang baru.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-teal-strong px-6 text-[15px] font-semibold text-white transition-all hover:brightness-110"
              >
                Hubungi admin
              </Link>
            </div>
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
