import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CalendarCheck2, ExternalLink, GraduationCap, MessageSquareQuote, TriangleAlert } from "lucide-react";
import { requireDb, schema } from "@/db";
import { getClassStatus } from "@/lib/class-status";
import { toProgramClass } from "@/lib/programs-service";
import { isStorageConfigured } from "@/lib/storage";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const db = await requireDb();
  const [programs, classes, teachers, testimonials] = await Promise.all([
    db.select({ id: schema.programs.id, published: schema.programs.published }).from(schema.programs),
    db.select().from(schema.programClasses),
    db.select({ id: schema.teachers.id, published: schema.teachers.published }).from(schema.teachers),
    db.select({ id: schema.testimonials.id, published: schema.testimonials.published }).from(schema.testimonials),
  ]);
  const now = Date.now();
  const openClasses = classes.filter((c) => getClassStatus(toProgramClass(c), now) === "open").length;

  const cards = [
    { href: "/admin/program", label: "Program", value: programs.length, note: `${programs.filter((p) => p.published).length} tampil di situs`, icon: BookOpen },
    { href: "/admin/program", label: "Kelas dibuka", value: openClasses, note: `dari ${classes.length} jadwal kelas`, icon: CalendarCheck2 },
    { href: "/admin/pengajar", label: "Pengajar", value: teachers.length, note: `${teachers.filter((t) => t.published).length} tampil di situs`, icon: GraduationCap },
    {
      href: "/admin/testimoni",
      label: "Testimoni",
      value: testimonials.length,
      note: `${testimonials.filter((t) => !t.published).length} disembunyikan`,
      icon: MessageSquareQuote,
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-[28px]">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-soft">Ringkasan konten situs. Perubahan yang disimpan langsung tampil di situs.</p>

      {!isStorageConfigured() && (
        <p className="mt-5 flex items-start gap-2 rounded-xl bg-brand-yellow-soft px-4 py-3 text-sm text-ink">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-warn" />
          Penyimpanan foto belum terhubung. Hubungkan Vercel Blob di menu Storage agar bisa mengunggah foto.
        </p>
      )}

      <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(({ href, label, value, note, icon: Icon }) => (
          <li key={label}>
            <Link href={href} className="block h-full rounded-[22px] border border-line bg-surface p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift md:p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-teal-soft text-brand-teal-dark">
                <Icon aria-hidden className="size-5" />
              </span>
              <p className="mt-3 text-3xl font-extrabold text-ink">{value}</p>
              <p className="text-sm font-semibold text-ink">{label}</p>
              <p className="text-xs text-ink-soft">{note}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-[22px] border border-line bg-surface p-5 shadow-soft">
        <h2 className="font-bold text-ink">Pintasan</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { href: "/admin/program", label: "Atur jadwal kelas" },
            { href: "/admin/pengajar/baru", label: "Tambah pengajar" },
            { href: "/admin/testimoni/baru", label: "Tambah testimoni" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex min-h-10 items-center rounded-full bg-background px-4 text-sm font-semibold text-ink ring-1 ring-line hover:ring-brand-teal/40">
              {l.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-brand-teal-dark hover:underline">
            Buka situs <ExternalLink aria-hidden className="size-3.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
