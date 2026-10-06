import type { Metadata } from "next";
import Link from "next/link";
import { desc, isNotNull } from "drizzle-orm";
import { CheckCircle2, ClipboardCheck, Inbox, Link2, LockKeyhole } from "lucide-react";
import { deleteTeacherLinkAction, toggleTeacherLinkAction } from "@/app/admin/actions/teacher-links";
import { NewTeacherLinkForm } from "@/components/admin/forms/NewTeacherLinkForm";
import { PinDialog } from "@/components/admin/PinDialog";
import { LinkCopyCell, ShareLinkActions } from "@/components/admin/ShareLinkActions";
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
import { requirePermission } from "@/lib/auth/session";
import { formatDateId } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Link Form Guru" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

const SHARE_INTRO = "Assalamu'alaikum Ustadz/Ustadzah, mohon melengkapi data pengajar Partner Belajar lewat link berikut:";
const SHARE_TEXT_OPEN = `${SHARE_INTRO}\n\n{url}\n\nJazakumullahu khairan.`;
const SHARE_TEXT_PIN = `${SHARE_INTRO}\n\n{url}\n\nPIN untuk membuka form akan kami kirim terpisah. Jazakumullahu khairan.`;

const GRID = "@3xl:grid-cols-[2rem_minmax(9rem,1fr)_minmax(0,14rem)_6.5rem_5.75rem_13.5rem]";

export default async function TeacherLinksPage({ searchParams }: PageProps) {
  await requirePermission("pengajar");
  const { pesan } = await searchParams;
  const db = await requireDb();

  const [links, submitted] = await Promise.all([
    db
      .select({
        id: schema.teacherLinks.id,
        token: schema.teacherLinks.token,
        label: schema.teacherLinks.label,
        active: schema.teacherLinks.active,
        pinHash: schema.teacherLinks.pinHash,
        createdAt: schema.teacherLinks.createdAt,
      })
      .from(schema.teacherLinks)
      .orderBy(desc(schema.teacherLinks.createdAt)),
    db
      .select({ linkId: schema.teachers.linkId, published: schema.teachers.published })
      .from(schema.teachers)
      .where(isNotNull(schema.teachers.linkId)),
  ]);

  const perLink = new Map<string, { total: number; pending: number }>();
  for (const row of submitted) {
    if (!row.linkId) continue;
    const entry = perLink.get(row.linkId) ?? { total: 0, pending: 0 };
    entry.total += 1;
    if (!row.published) entry.pending += 1;
    perLink.set(row.linkId, entry);
  }
  const pendingTotal = [...perLink.values()].reduce((sum, e) => sum + e.pending, 0);

  return (
    <div className="adm-fade-in">
      <AdminPageHeader
        title="Link Form Guru"
        description="Buat link agar para guru mengisi data profilnya sendiri (PIN bersifat opsional). Data yang masuk berstatus tersembunyi sampai Anda tinjau dan tampilkan."
        back={{ href: "/admin/pengajar", label: "Semua pengajar" }}
        searchPlaceholder={links.length > 1 ? "Cari link..." : undefined}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />

      <StatCards
        items={[
          { label: "Total link", value: links.length, icon: Link2, tone: "teal" },
          { label: "Link aktif", value: links.filter((l) => l.active).length, icon: CheckCircle2, tone: "green" },
          { label: "Data masuk", value: submitted.length, icon: Inbox, tone: "yellow", href: "/admin/pengajar" },
          { label: "Perlu ditinjau", value: pendingTotal, icon: ClipboardCheck, tone: "purple", href: "/admin/pengajar" },
        ]}
      />

      <section className="mb-6 rounded-2xl border border-white/80 bg-surface p-5 shadow-soft dark:border-line md:p-6">
        <h2 className="text-[15px] font-semibold text-ink">Buat link baru</h2>
        <p className="mt-0.5 mb-4 text-[13px] text-ink-soft">
          Satu link bisa dipakai banyak guru. Tanpa PIN, siapa pun yang memegang link bisa mengisi; dengan PIN, harus memegang link <strong>dan</strong> tahu PIN-nya. Data yang masuk tetap Anda tinjau dulu sebelum tampil.
        </p>
        <NewTeacherLinkForm />
      </section>

      {links.length === 0 ? (
        <EmptyState>Belum ada link. Buat link pertama di atas, lalu kirim ke para guru.</EmptyState>
      ) : (
        <ListCard count={links.length} head={["No", "Nama link", "Link", "Data masuk", "Status", "Aksi"]} cols={GRID}>
          {links.map((link, index) => {
            const path = `/form-guru/${link.token}`;
            const stat = perLink.get(link.id) ?? { total: 0, pending: 0 };
            const hasPin = Boolean(link.pinHash);
            return (
              <ListRow key={link.id} muted={!link.active} cols={GRID} search={link.label}>
                <RowNumber n={index + 1} />
                <div className="row-main min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{link.label}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-soft">
                    {hasPin ? (
                      <Badge tone="teal">
                        <LockKeyhole aria-hidden className="size-3" />
                        Pakai PIN
                      </Badge>
                    ) : (
                      <Badge>Tanpa PIN</Badge>
                    )}
                    <span>Dibuat {formatDateId(link.createdAt.toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" }))}</span>
                  </p>
                </div>
                <LinkCopyCell path={path} siteUrl={siteConfig.url} active={link.active} />
                <div className="text-sm text-ink-soft">
                  <span className="font-semibold text-ink tabular-nums">{stat.total}</span> guru
                  {stat.pending > 0 && (
                    <Link href="/admin/pengajar" className="mt-0.5 block text-xs font-medium text-warn hover:underline">
                      {stat.pending} perlu ditinjau
                    </Link>
                  )}
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
                <ShareLinkActions
                  id={link.id}
                  label={link.label}
                  path={path}
                  siteUrl={siteConfig.url}
                  active={link.active}
                  toggleAction={toggleTeacherLinkAction}
                  deleteAction={deleteTeacherLinkAction}
                  shareText={hasPin ? SHARE_TEXT_PIN : SHARE_TEXT_OPEN}
                  deleteMessage={`Hapus link "${link.label}"? Guru tidak bisa lagi mengisi form lewat link ini. Data guru yang sudah masuk tetap tersimpan.`}
                >
                  <PinDialog id={link.id} label={link.label} hasPin={hasPin} />
                </ShareLinkActions>
              </ListRow>
            );
          })}
        </ListCard>
      )}
    </div>
  );
}
