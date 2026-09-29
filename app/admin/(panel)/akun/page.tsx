import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/admin/forms/AccountForms";
import { AdminPageHeader, Badge } from "@/components/admin/ui";
import { PERMISSIONS, ROLE_LABELS } from "@/lib/auth/permissions";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Akun saya" };

export default async function MyAccountPage() {
  const me = await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Akun saya" description="Data akun Anda dan pengaturan password." />
      <div className="adm-fade-in grid gap-8">
        <section className="grid gap-4 border-b border-line pb-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Profil</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">Peran dan menu ditentukan oleh Pemilik.</p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink">{me.name}</p>
            <p className="text-sm text-ink-soft">{me.email}</p>
            <p className="mt-3 flex flex-wrap items-center gap-1.5">
              <Badge tone={me.role === "owner" ? "info" : "neutral"}>{ROLE_LABELS[me.role]}</Badge>
              {me.role === "owner" ? (
                <Badge>Semua menu</Badge>
              ) : (
                PERMISSIONS.filter((p) => me.permissions.includes(p.key)).map((p) => <Badge key={p.key}>{p.label}</Badge>)
              )}
            </p>
          </div>
        </section>
        <ChangePasswordForm />
      </div>
    </>
  );
}
