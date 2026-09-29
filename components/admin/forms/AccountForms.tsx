"use client";

import Link from "next/link";
import { useState } from "react";
import { changePasswordAction, createAdminAction, updateAdminAction } from "@/app/admin/actions/account";
import type { AdminRole, PermissionKey } from "@/lib/auth/permissions";
import { PERMISSIONS, ROLE_LABELS } from "@/lib/auth/permissions";
import { AdminForm, useFieldError } from "../AdminForm";
import { FormSection, TextField } from "../fields";

const ROLE_HELP: Record<AdminRole, string> = {
  owner: "Akses ke semua menu dan bisa mengelola akun admin lain.",
  editor: "Hanya bisa membuka menu yang dicentang di bawah.",
};

/** Pilihan peran + hak akses menu (dipakai saat menambah & mengubah admin). */
function AccessFields({ role: initialRole = "editor", permissions = [], lockRole }: { role?: AdminRole; permissions?: PermissionKey[]; lockRole?: boolean }) {
  const roleError = useFieldError("role");
  const permissionsError = useFieldError("permissions");
  const [role, setRole] = useState<AdminRole>(initialRole);
  return (
    <FormSection title="Peran & hak akses" description="Tentukan apa yang boleh dibuka dan diubah oleh admin ini.">
      <fieldset>
        <legend className="mb-1.5 text-[13px] font-medium text-ink">Peran</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(["editor", "owner"] as const).map((r) => (
            <label
              key={r}
              className={`flex cursor-pointer flex-col gap-0.5 rounded-lg border border-line bg-surface px-3.5 py-3 has-[:checked]:border-brand-teal has-[:checked]:bg-brand-teal-soft ${lockRole ? "opacity-70" : ""}`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                <input type="radio" name="role" value={r} checked={role === r} disabled={lockRole && role !== r} onChange={() => setRole(r)} className="size-4 accent-[var(--brand-teal)]" />
                {ROLE_LABELS[r]}
              </span>
              <span className="pl-6 text-xs text-ink-soft">{ROLE_HELP[r]}</span>
            </label>
          ))}
        </div>
        {lockRole && <input type="hidden" name="role" value={role} />}
        {roleError && <p className="mt-1.5 text-xs font-medium text-red-600">{roleError}</p>}
      </fieldset>
      <fieldset disabled={role === "owner"} className={role === "owner" ? "opacity-50" : ""}>
        <legend className="mb-1.5 text-[13px] font-medium text-ink">Menu yang boleh diakses</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {PERMISSIONS.map((p) => (
            <label key={p.key} className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-2.5 has-[:checked]:border-brand-teal has-[:checked]:bg-brand-teal-soft">
              <input type="checkbox" name="permissions[]" value={p.key} defaultChecked={role === "owner" || permissions.includes(p.key)} className="mt-0.5 size-4 accent-[var(--brand-teal)]" />
              <span>
                <span className="block text-sm font-medium text-ink">{p.label}</span>
                <span className="block text-xs text-ink-soft">{p.description}</span>
              </span>
            </label>
          ))}
        </div>
        {role === "owner" && <p className="mt-2 text-xs text-ink-soft">Pemilik otomatis punya akses ke semua menu.</p>}
        {permissionsError && <p className="mt-1.5 text-xs font-medium text-red-600">{permissionsError}</p>}
      </fieldset>
    </FormSection>
  );
}

function PasswordFields() {
  const e = useFieldError;
  return (
    <FormSection title="Ganti password">
      <TextField label="Password saat ini" name="current" type="password" autoComplete="current-password" required error={e("current")} />
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Password baru" name="next" type="password" autoComplete="new-password" minLength={10} hint="Minimal 10 karakter." required error={e("next")} />
        <TextField label="Ulangi password baru" name="confirm" type="password" autoComplete="new-password" required error={e("confirm")} />
      </div>
    </FormSection>
  );
}

export function ChangePasswordForm() {
  return (
    <AdminForm action={changePasswordAction} submitLabel="Ganti password">
      <PasswordFields />
    </AdminForm>
  );
}

function NewAdminFields() {
  const e = useFieldError;
  return (
    <FormSection title="Tambah admin" description="Admin baru bisa login dengan email & password ini, lalu sebaiknya langsung mengganti passwordnya.">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Nama" name="name" required error={e("name")} />
        <TextField label="Email" name="email" type="email" autoComplete="off" required error={e("email")} />
      </div>
      <TextField label="Password awal" name="password" type="password" autoComplete="new-password" minLength={10} hint="Minimal 10 karakter." required error={e("password")} />
    </FormSection>
  );
}

export function NewAdminForm() {
  return (
    <AdminForm action={createAdminAction} submitLabel="Tambah admin">
      <NewAdminFields />
      <AccessFields />
    </AdminForm>
  );
}

export function EditAdminForm({
  admin,
  isSelf,
}: {
  admin: { id: string; name: string; email: string; role: AdminRole; permissions: PermissionKey[] };
  isSelf: boolean;
}) {
  const e = useFieldError;
  return (
    <AdminForm
      action={updateAdminAction}
      submitLabel="Simpan perubahan"
      footer={
        <Link href="/admin/akun" className="text-sm font-medium text-ink-soft hover:text-ink">
          Batal
        </Link>
      }
    >
      <input type="hidden" name="id" value={admin.id} />
      <FormSection title="Profil" description={admin.email}>
        <TextField label="Nama" name="name" defaultValue={admin.name} required error={e("name")} />
        <TextField
          label="Password baru"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={10}
          hint="Kosongkan bila tidak ingin mengganti password. Minimal 10 karakter."
          error={e("newPassword")}
        />
      </FormSection>
      <AccessFields role={admin.role} permissions={admin.permissions} lockRole={isSelf} />
    </AdminForm>
  );
}
