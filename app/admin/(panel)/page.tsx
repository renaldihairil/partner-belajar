import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarCheck2, GraduationCap, MessageSquareQuote } from "lucide-react";
import { DashboardActivity, DashboardSystem, DashboardUpcoming } from "@/components/admin/DashboardPanels";
import { requireDb, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";
import { getClassStatus } from "@/lib/class-status";
import { toProgramClass } from "@/lib/programs-service";
import { isStorageConfigured } from "@/lib/storage";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const [admin, db] = await Promise.all([requireAdmin(), requireDb()]);
  const [programs, classes, teachers, testimonials] = await Promise.all([
    db
      .select({ id: schema.programs.id, title: schema.programs.title, published: schema.programs.published, updatedAt: schema.programs.updatedAt })
      .from(schema.programs),
    db.select().from(schema.programClasses),
    db
      .select({ id: schema.teachers.id, name: schema.teachers.name, published: schema.teachers.published, updatedAt: schema.teachers.updatedAt })
      .from(schema.teachers),
    db
      .select({
        id: schema.testimonials.id,
        name: schema.testimonials.name,
        published: schema.testimonials.published,
        rating: schema.testimonials.rating,
        updatedAt: schema.testimonials.updatedAt,
      })
      .from(schema.testimonials),
  ]);

  const now = Date.now();
  const withStatus = classes.map((c) => ({ row: c, status: getClassStatus(toProgramClass(c), now) }));
  const openClasses = withStatus.filter((c) => c.status === "open");
  const programTitle = new Map(programs.map((p) => [p.id, p.title]));
  const avgRating = testimonials.length ? testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length : 0;

  const stats = [
    { href: "/admin/program", label: "Program aktif", value: programs.filter((p) => p.published).length, note: `dari ${programs.length} program`, icon: BookOpen },
    { href: "/admin/program", label: "Kelas dibuka", value: openClasses.length, note: `dari ${classes.length} jadwal kelas`, icon: CalendarCheck2 },
    { href: "/admin/pengajar", label: "Pengajar", value: teachers.filter((t) => t.published).length, note: `${teachers.length} total profil`, icon: GraduationCap },
    {
      href: "/admin/testimoni",
      label: "Testimoni",
      value: testimonials.filter((t) => t.published).length,
      note: `rating rata-rata ${avgRating.toLocaleString("id-ID", { maximumFractionDigits: 1 })}`,
      icon: MessageSquareQuote,
    },
  ];

  const upcoming = withStatus
    .filter((c) => c.status !== "closed")
    .sort((a, b) => a.row.classStarts.localeCompare(b.row.classStarts))
    .slice(0, 5)
    .map((c) => ({ ...c, programTitle: programTitle.get(c.row.programId) ?? "" }));

  const activity = [
    ...programs.map((p) => ({ kind: "Program", name: p.title, href: `/admin/program/${p.id}`, at: p.updatedAt })),
    ...teachers.map((t) => ({ kind: "Pengajar", name: t.name, href: `/admin/pengajar/${t.id}`, at: t.updatedAt })),
    ...testimonials.map((t) => ({ kind: "Testimoni", name: t.name, href: `/admin/testimoni/${t.id}`, at: t.updatedAt })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 6)
    .map((a) => ({ ...a, at: a.at.toISOString() }));

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });

  return (
    <div className="adm-fade-in grid gap-6">
      <div>
        <p className="text-[13px] font-medium text-ink-soft">{today}</p>
        <h1 className="mt-0.5 text-[22px] font-semibold tracking-tight text-ink md:text-2xl">Assalamu&apos;alaikum, {admin.name}</h1>
        <p className="mt-1 text-sm text-ink-soft">Ringkasan konten situs Partner Belajar. Perubahan yang disimpan langsung tampil di situs.</p>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map(({ href, label, value, note, icon: Icon }) => (
          <li key={label}>
            <Link href={href} className="group block h-full rounded-xl border border-line bg-surface p-4 shadow-soft transition-all hover:border-brand-teal/30 hover:shadow-lift md:p-5">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-ink-soft">{label}</p>
                <span className="grid size-8 place-items-center rounded-lg bg-brand-teal-soft text-brand-teal-dark">
                  <Icon aria-hidden className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
                {note}
                <ArrowUpRight aria-hidden className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardUpcoming items={upcoming} />
        <div className="grid content-start gap-6">
          <DashboardSystem storage={isStorageConfigured()} />
          <DashboardActivity items={activity} />
        </div>
      </div>
    </div>
  );
}
