import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { deleteTeacherAction, moveTeacherAction, toggleTeacherAction } from "@/app/admin/actions/teachers";
import { RowActions } from "@/components/admin/RowActions";
import { AddLink, AdminPageHeader, Badge, EmptyState, ListCard, ListRow, Notice, noticeMessages, StatusBadge } from "@/components/admin/ui";
import { TeacherAvatar } from "@/components/teachers/TeacherAvatar";
import { requireDb, schema } from "@/db";
import { programOptions } from "@/lib/admin/queries";
import { toTeacher } from "@/lib/programs-service";

export const metadata: Metadata = { title: "Pengajar" };

type PageProps = { searchParams: Promise<{ pesan?: string }> };

export default async function AdminTeachersPage({ searchParams }: PageProps) {
  const { pesan } = await searchParams;
  const db = await requireDb();
  const [items, programs] = await Promise.all([db.select().from(schema.teachers).orderBy(asc(schema.teachers.sortOrder)), programOptions()]);
  const programName = new Map(programs.map((p) => [p.value, p.label]));

  return (
    <div className="adm-fade-in">
      <AdminPageHeader
        title="Pengajar"
        description="Profil pengajar yang tampil di halaman Pengajar. Urutan di sini sama dengan urutan tampil."
        action={<AddLink href="/admin/pengajar/baru">Tambah pengajar</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      {items.length === 0 ? (
        <EmptyState action={<AddLink href="/admin/pengajar/baru">Tambah pengajar</AddLink>}>Belum ada pengajar.</EmptyState>
      ) : (
        <ListCard title="Semua pengajar" count={items.length}>
          {items.map((item, index) => (
            <ListRow key={item.id} muted={!item.published}>
              <Link href={`/admin/pengajar/${item.id}`} className="row-main group flex min-w-0 flex-1 items-center gap-3.5">
                <span className="size-11 shrink-0 overflow-clip rounded-full bg-[var(--adm-hover)] ring-1 ring-line">
                  {item.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- foto dari Blob / lokal
                    <img src={item.photo} alt="" className="size-full object-cover" />
                  ) : (
                    <TeacherAvatar teacher={toTeacher(item)} className="size-full" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink group-hover:text-brand-teal-dark">{item.name}</span>
                  <span className="block truncate text-[13px] text-ink-soft">
                    {item.title} · {item.experienceYears} th mengajar
                  </span>
                </span>
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 md:w-72 md:justify-end">
                {item.programIds.map((id) => (
                  <Badge key={id} tone="info">
                    {programName.get(id) ?? id}
                  </Badge>
                ))}
                <StatusBadge published={item.published} />
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
