import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ProgramTabs } from "@/components/admin/ProgramTabs";
import { requireDb, schema } from "@/db";

export default async function ProgramAdminLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await requireDb();
  const [[program], [{ value: classCount }]] = await Promise.all([
    db.select({ title: schema.programs.title, slug: schema.programs.slug }).from(schema.programs).where(eq(schema.programs.id, id)).limit(1),
    db.select({ value: count() }).from(schema.programClasses).where(eq(schema.programClasses.programId, id)),
  ]);
  if (!program) notFound();

  return (
    <>
      <Link href="/admin/program" className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-brand-teal-dark">
        <ArrowLeft aria-hidden className="size-4" />
        Semua program
      </Link>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-[28px]">{program.title}</h1>
        <Link
          href={`/program/${program.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal-dark hover:underline"
        >
          Lihat halaman <ExternalLink aria-hidden className="size-3.5" />
        </Link>
      </div>
      <ProgramTabs programId={id} classCount={classCount} />
      {children}
    </>
  );
}
