import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteAdminAction } from "@/app/admin/actions/account";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { NewAdminForm } from "@/components/admin/forms/AccountForms";
import { AdminPageHeader, Badge, Notice, noticeMessages } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { PERMISSIONS, ROLE_LABELS } from "@/lib/auth/permissions";
import { requireOwner } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Kelola admin" };

const messages: Record<string, string> = {
  ...noticeMessages,
  dibuat: "Admin baru berhasil ditambahkan.",
  dihapus: "Admin berhasil dihapus.",
  "diri-sendiri": "Anda tidak bisa menghapus akun sendiri.",
  "pemilik-terakhir": "Harus ada minimal satu Pemilik.",
};

function lastLogin(date: Date | null) {
  if (!date) return "Belum pernah masuk";
  const text = date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });
  return `Terakhir masuk ${text} WIB`;
}

export default async function ManageAdminsPage({ searchParams }: { searchParams: Promise<{ pesan?: string }> }) {
  const { pesan } = await searchParams;
  const me = await requireOwner();
  const db = await requireDb();
  const admins = await db
    .select({
      id: schema.adminUsers.id,
      name: schema.adminUsers.name,
      email: schema.adminUsers.email,
      role: schema.adminUsers.role,
      permissions: schema.adminUsers.permissions,
      lastLoginAt: schema.adminUsers.lastLoginAt,
    })
    .from(schema.adminUsers)
    .orderBy(asc(schema.adminUsers.createdAt));

  return (
    <>
      <AdminPageHeader title="Kelola admin" description="Atur siapa saja yang bisa masuk ke admin panel dan menu apa yang boleh dibuka. Hanya Pemilik yang bisa membuka halaman ini." />
      <Notice message={pesan ? messages[pesan] : undefined} />
      <div className="adm-fade-in grid gap-8">
        <section className="grid gap-4 border-b border-line pb-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Daftar admin</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">Pemilik punya akses penuh. Editor hanya membuka menu yang diizinkan.</p>
          </div>
          <ul className="divide-y divide-line overflow-clip rounded-2xl border border-line bg-surface shadow-soft">
            {admins.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink">
                    {a.name} {a.id === me.id && <Badge tone="success">Anda</Badge>}
                  </p>
                  <p className="truncate text-sm text-ink-soft">{a.email}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone={a.role === "owner" ? "info" : "neutral"}>{ROLE_LABELS[a.role]}</Badge>
                    {a.role === "editor" &&
                      PERMISSIONS.filter((p) => a.permissions.includes(p.key)).map((p) => <Badge key={p.key}>{p.label}</Badge>)}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">{lastLogin(a.lastLoginAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                <Link href={`/admin/pengguna/${a.id}`} className="grid size-8 place-items-center rounded-md text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink" aria-label={`Ubah admin ${a.name}`} title="Ubah peran & akses">
                  <Pencil aria-hidden className="size-4" />
                </Link>
                {a.id !== me.id && (
                  <ConfirmForm action={deleteAdminAction} message={`Hapus admin ${a.name}? Ia tidak akan bisa masuk lagi.`}>
                    <input type="hidden" name="id" value={a.id} />
                    <button
                      type="submit"
                      className="grid size-8 place-items-center rounded-md text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                      aria-label={`Hapus admin ${a.name}`}
                    >
                      <Trash2 aria-hidden className="size-4" />
                    </button>
                  </ConfirmForm>
                )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <NewAdminForm />
      </div>
    </>
  );
}
