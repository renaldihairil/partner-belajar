"use client";

import { changePasswordAction, createAdminAction } from "@/app/admin/actions/account";
import { AdminForm, useFieldError } from "../AdminForm";
import { FormSection, TextField } from "../fields";

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
    </AdminForm>
  );
}
