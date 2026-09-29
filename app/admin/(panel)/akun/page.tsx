import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import { deleteAdminAction } from "@/app/admin/actions/account";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { ChangePasswordForm, NewAdminForm } from "@/components/admin/forms/AccountForms";
import { AdminPageHeader, Badge, Notice, noticeMessages } from "@/components/admin/ui";
import { requireDb, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Akun admin" };

const messages: Record<string, string> = {
  ...noticeMessages,
  dibuat: "Admin baru berhasil ditambahkan.",
  dihapus: "Admin berhasil dihapus.",
  "diri-sendiri": "Anda tidak bisa menghapus akun sendiri.",
};

function lastLogin(date: Date | null) {
  if (!date) return "Belum pernah masuk";
  const text = date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });
  return `Terakhir masuk ${text} WIB`;
}

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ pesan?: string }> }) {
  const { pesan } = await searchParams;
  const me = await requireAdmin();
  const db = await requireDb();
  const admins = await db
    .select({ id: schema.adminUsers.id, name: schema.adminUsers.name, email: schema.adminUsers.email, lastLoginAt: schema.adminUsers.lastLoginAt })
    .from(schema.adminUsers)
    .orderBy(asc(schema.adminUsers.createdAt));

  return (
    <>
      <AdminPageHeader title="Akun admin" description="Kelola password Anda dan siapa saja yang bisa masuk ke admin panel." />
      <Notice message={pesan ? messages[pesan] : undefined} />
      <div className="grid gap-8">
        <ChangePasswordForm />

        <section className="rounded-[22px] border border-line bg-surface p-5 shadow-soft md:p-6">
          <h2 className="text-base font-bold text-ink">Daftar admin</h2>
          <ul className="mt-3 divide-y divide-line">
            {admins.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                    {a.name} {a.id === me.id && <Badge tone="success">Anda</Badge>}
                  </p>
                  <p className="truncate text-sm text-ink-soft">{a.email}</p>
                  <p className="text-xs text-ink-soft">{lastLogin(a.lastLoginAt)}</p>
                </div>
                {a.id !== me.id && admins.length > 1 && (
                  <ConfirmForm action={deleteAdminAction} message={`Hapus admin ${a.name}? Ia tidak akan bisa masuk lagi.`}>
                    <input type="hidden" name="id" value={a.id} />
                    <button
                      type="submit"
                      className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Hapus admin ${a.name}`}
                    >
                      <Trash2 aria-hidden className="size-4" />
                    </button>
                  </ConfirmForm>
                )}
              </li>
            ))}
          </ul>
        </section>

        <NewAdminForm />
      </div>
    </>
  );
}
