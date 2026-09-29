import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { deleteTeacherAction, moveTeacherAction, toggleTeacherAction } from "@/app/admin/actions/teachers";
import { RowActions } from "@/components/admin/RowActions";
import { AddLink, AdminPageHeader, Badge, EmptyState, Notice, noticeMessages } from "@/components/admin/ui";
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
    <>
      <AdminPageHeader
        title="Pengajar"
        description="Urutan di sini = urutan tampil di halaman Pengajar."
        action={<AddLink href="/admin/pengajar/baru">Tambah pengajar</AddLink>}
      />
      <Notice message={pesan ? noticeMessages[pesan] : undefined} />
      {items.length === 0 ? (
        <EmptyState>Belum ada pengajar.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {items.map((item, index) => (
            <li key={item.id} className={`rounded-[20px] border border-line bg-surface p-4 shadow-soft ${item.published ? "" : "opacity-70"}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="size-14 shrink-0 overflow-clip rounded-2xl bg-background">
                    {item.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- foto dari Blob / lokal
                      <img src={item.photo} alt="" className="size-full object-cover" />
                    ) : (
                      <TeacherAvatar teacher={toTeacher(item)} className="size-full" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-ink">{item.name}</p>
                      {!item.published && <Badge tone="warning">Disembunyikan</Badge>}
                    </div>
                    <p className="text-sm text-ink-soft">
                      {item.title} · {item.experienceYears} th mengajar
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.programIds.map((id) => (
                        <Badge key={id} tone="success">
                          {programName.get(id) ?? id}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
