import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ProgramTabs } from "@/components/admin/ProgramTabs";
import { buttonSecondary, StatusBadge } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";

export default async function ProgramAdminLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await requireDb();
  const [[program], [{ value: classCount }]] = await Promise.all([
    db
      .select({
        title: schema.programs.title,
        slug: schema.programs.slug,
        image: schema.programs.image,
        theme: schema.programs.theme,
        category: schema.programs.category,
        published: schema.programs.published,
      })
      .from(schema.programs)
      .where(eq(schema.programs.id, id))
      .limit(1),
    db.select({ value: count() }).from(schema.programClasses).where(eq(schema.programClasses.programId, id)),
  ]);
  if (!program) notFound();

  return (
    <div className="adm-fade-in">
      <Link href="/admin/program" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" />
        Semua program
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <span className={`theme-${program.theme} program-surface grid size-14 shrink-0 place-items-center overflow-clip rounded-xl ring-1 ring-line`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail dari lokal / Blob */}
          <img src={program.image} alt="" className="size-12 object-contain" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[22px] font-semibold tracking-tight text-ink md:text-2xl">{program.title}</h1>
            <StatusBadge published={program.published} />
          </div>
          <p className="text-sm text-ink-soft">
            {program.category} · /program/{program.slug}
          </p>
        </div>
        <Link href={`/program/${program.slug}`} target="_blank" className={buttonSecondary}>
          Lihat halaman
          <ExternalLink aria-hidden className="size-3.5" />
        </Link>
      </div>
      <ProgramTabs programId={id} classCount={classCount} />
      {children}
    </div>
  );
}
