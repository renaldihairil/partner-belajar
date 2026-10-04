import type { Metadata } from "next";
import { count, desc, eq, isNotNull } from "drizzle-orm";
import { CheckCircle2, Link2, MessageSquareQuote, PauseCircle } from "lucide-react";
import {
  deleteTestimonialLinkAction,
  toggleTestimonialLinkAction,
} from "@/app/admin/actions/testimonial-links";
import { NewLinkForm } from "@/components/admin/forms/NewLinkForm";
import { LinkCopyCell, TestimonialLinkActions } from "@/components/admin/TestimonialLinkActions";
import {
  AdminPageHeader,
  Badge,
  EmptyState,
  ListCard,
  ListRow,
  Notice,
  noticeMessages,
  RowNumber,
  StatCards,
} from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { programOptions } from "@/lib/admin/queries";
import { requirePermission } from "@/lib/auth/session";
import { formatDateId } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Link Testimoni" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

const GRID = "@3xl:grid-cols-[2rem_minmax(9rem,1fr)_minmax(0,15rem)_5.5rem_5.75rem_10.5rem]";

export default async function TestimonialLinksPage({ searchParams }: PageProps) {
  await requirePermission("testimoni");
  const { pesan } = await searchParams;
  const db = await requireDb();

  const [links, perLink, programs] = await Promise.all([
    db
      .select({
        id: schema.testimonialLinks.id,
        token: schema.testimonialLinks.token,
        label: schema.testimonialLinks.label,
        active: schema.testimonialLinks.active,
        createdAt: schema.testimonialLinks.createdAt,
        programTitle: schema.programs.title,
      })
      .from(schema.testimonialLinks)
      .leftJoin(schema.programs, eq(schema.programs.id, schema.testimonialLinks.programId))
      .orderBy(desc(schema.testimonialLinks.createdAt)),
    db
      .select({ linkId: schema.testimonials.linkId, total: count() })
      .from(schema.testimonials)
      .where(isNotNull(schema.testimonials.linkId))
      .groupBy(schema.testimonials.linkId),
    programOptions(),
  ]);

  const received = new Map(perLink.map((row) => [row.linkId, row.total]));
  const totalReceived = perLink.reduce((sum, row) => sum + row.total, 0);
  const activeCount = links.filter((l) => l.active).length;

  return (
    <div className="adm-fade-in">
      <AdminPageHeader
        title="Link Testimoni"
        description="Buat link, salin, lalu bagikan ke orang tua (misalnya lewat WhatsApp). Testimoni yang dikirim lewat link langsung tampil di website."
        back={{ href: "/admin/testimoni", label: "Semua testimoni" }}
        searchPlaceholder={links.length > 1 ? "Cari link..." : undefined}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />

      <StatCards
        items={[
          { label: "Total link", value: links.length, icon: Link2, tone: "teal" },
          { label: "Link aktif", value: activeCount, icon: CheckCircle2, tone: "green" },
          { label: "Link nonaktif", value: links.length - activeCount, icon: PauseCircle, tone: "purple" },
          { label: "Terkumpul", value: totalReceived, icon: MessageSquareQuote, tone: "yellow", href: "/admin/testimoni" },
        ]}
      />

      <section className="mb-6 rounded-2xl border border-white/80 bg-surface p-5 shadow-soft dark:border-line md:p-6">
        <h2 className="text-[15px] font-semibold text-ink">Buat link baru</h2>
        <p className="mt-0.5 mb-4 text-[13px] text-ink-soft">
          Satu link bisa dipakai banyak orang tua. Buat link terpisah per program bila ingin tahu testimoni masuk dari mana.
        </p>
        <NewLinkForm programs={programs} />
      </section>

      {links.length === 0 ? (
        <EmptyState>Belum ada link. Buat link pertama di atas, lalu salin dan bagikan ke orang tua.</EmptyState>
      ) : (
        <ListCard count={links.length} head={["No", "Nama link", "Link", "Masuk", "Status", "Aksi"]} cols={GRID}>
          {links.map((link, index) => {
            const path = `/kirim-testimoni/${link.token}`;
            const total = received.get(link.id) ?? 0;
            return (
              <ListRow key={link.id} muted={!link.active} cols={GRID} search={`${link.label} ${link.programTitle ?? ""}`}>
                <RowNumber n={index + 1} />
                <div className="row-main min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{link.label}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-soft">
                    {link.programTitle ? <Badge tone="info">{link.programTitle}</Badge> : <span>Semua program</span>}
                    <span>Dibuat {formatDateId(link.createdAt.toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" }))}</span>
                  </p>
                </div>
                <LinkCopyCell path={path} siteUrl={siteConfig.url} active={link.active} />
                <div className="text-sm text-ink-soft">
                  <span className="font-semibold text-ink tabular-nums">{total}</span> testimoni
                </div>
                <div>
                  {link.active ? (
                    <Badge tone="success" dot>
                      Aktif
                    </Badge>
                  ) : (
                    <Badge tone="neutral" dot>
                      Nonaktif
                    </Badge>
                  )}
                </div>
                <TestimonialLinkActions
                  id={link.id}
                  label={link.label}
                  path={path}
                  siteUrl={siteConfig.url}
                  active={link.active}
                  toggleAction={toggleTestimonialLinkAction}
                  deleteAction={deleteTestimonialLinkAction}
                />
              </ListRow>
            );
          })}
        </ListCard>
      )}
    </div>
  );
}
