import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { ClipboardCheck, ClipboardList, Eye, GraduationCap, Users } from "lucide-react";
import { deleteTeacherAction, moveTeacherAction, toggleTeacherAction } from "@/app/admin/actions/teachers";
import { RowActions } from "@/components/admin/RowActions";
import {
  AddLink,
  AdminPageHeader,
  Badge,
  buttonSecondary,
  EmptyState,
  ListCard,
  ListRow,
  Notice,
  noticeMessages,
  RowNumber,
  StatCards,
  StatusBadge,
  type StatItem,
} from "@/components/admin/ui";
import { TeacherAvatar } from "@/components/teachers/TeacherAvatar";
import { requireDb, schema } from "@/db";
import { programOptions } from "@/lib/admin/queries";
import { toTeacher } from "@/lib/programs-service";

export const metadata: Metadata = { title: "Pengajar" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

const GRID = "@3xl:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,14rem)_8rem_13rem]";
const programTones = ["blue", "yellow", "purple"] as const;

export default async function AdminTeachersPage({ searchParams }: PageProps) {
  const { pesan } = await searchParams;
  const db = await requireDb();
  const [items, programs] = await Promise.all([db.select().from(schema.teachers).orderBy(asc(schema.teachers.sortOrder)), programOptions()]);
  const programName = new Map(programs.map((p) => [p.value, p.label]));
  // Data kiriman guru lewat link form berstatus tersembunyi sampai admin meninjau dan menampilkannya.
  const pending = items.filter((t) => t.linkId && !t.published);
  const stats: StatItem[] = [
    { label: "Total pengajar", value: items.length, icon: Users, tone: "teal" },
    { label: "Tampil di situs", value: items.filter((t) => t.published).length, icon: Eye, tone: "green" },
    ...(pending.length > 0
      ? [{ label: "Perlu ditinjau", value: pending.length, icon: ClipboardCheck, tone: "yellow" as const, note: "kiriman dari form guru" }]
      : []),
    ...programs.slice(0, pending.length > 0 ? 1 : 2).map((p, i) => ({
      label: p.label,
      note: "pengajar",
      value: items.filter((t) => t.programIds.includes(p.value)).length,
      icon: GraduationCap,
      tone: programTones[i],
    })),
  ];

  return (
    <div className="adm-fade-in">
      <AdminPageHeader
        title="Pengajar"
        description="Profil pengajar yang tampil di halaman Pengajar. Urutan di sini sama dengan urutan tampil."
        searchPlaceholder="Cari pengajar..."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/link-guru" className={buttonSecondary}>
              <ClipboardList aria-hidden className="size-4" />
              Link form guru
            </Link>
            <AddLink href="/admin/pengajar/baru">Tambah Pengajar</AddLink>
          </div>
        }
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      <StatCards items={stats} />
      {items.length === 0 ? (
        <EmptyState action={<AddLink href="/admin/pengajar/baru">Tambah Pengajar</AddLink>}>Belum ada pengajar.</EmptyState>
      ) : (
        <ListCard count={items.length} head={["No", "Pengajar", "Program", "Status", "Aksi"]} cols={GRID}>
          {items.map((item, index) => (
            <ListRow
              key={item.id}
              muted={!item.published}
              cols={GRID}
              search={`${item.name} ${item.title} ${item.education} ${item.programIds.map((id) => programName.get(id) ?? id).join(" ")}`}
            >
              <RowNumber n={index + 1} />
              <Link href={`/admin/pengajar/${item.id}`} className="row-main group flex min-w-0 items-center gap-3.5">
                <span className="size-12 shrink-0 overflow-clip rounded-full bg-[var(--adm-hover)] shadow-soft ring-2 ring-white dark:ring-line">
                  {item.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- foto dari Blob / lokal
                    <img src={item.photo} alt="" className="size-full object-cover" />
                  ) : (
                    <TeacherAvatar teacher={toTeacher(item)} className="size-full" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-ink group-hover:text-brand-teal-dark">{item.name}</span>
                    {item.linkId && <Badge tone="teal">Via form</Badge>}
                  </span>
                  <span className="block truncate text-[13px] text-ink-soft">
                    {item.title} · {item.experienceYears} th mengajar
                  </span>
                </span>
              </Link>
              <div className="flex flex-wrap items-center gap-1.5">
                {item.programIds.length === 0 && <span className="text-xs text-ink-soft">—</span>}
                {item.programIds.map((id) => (
                  <Badge key={id} tone="info">
                    {programName.get(id) ?? id}
                  </Badge>
                ))}
              </div>
              <div>
                {item.linkId && !item.published ? (
                  <Badge tone="warning" dot>
                    Perlu ditinjau
                  </Badge>
                ) : (
                  <StatusBadge published={item.published} labels={["Aktif", "Disembunyikan"]} />
                )}
              </div>
              <RowActions
                id={item.id}
                label={item.name}
                editHref={`/admin/pengajar/${item.id}`}
                published={item.published}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                moveAction={moveTeacherAction}
                toggleAction={toggleTeacherAction}
                deleteAction={deleteTeacherAction}
              />
            </ListRow>
          ))}
        </ListCard>
      )}
    </div>
  );
}
