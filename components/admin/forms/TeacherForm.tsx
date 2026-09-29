"use client";

import Link from "next/link";
import { saveTeacherAction } from "@/app/admin/actions/teachers";
import type { TeacherRow } from "@/db/schema";
import { AdminForm, useFieldError } from "../AdminForm";
import { ImageUpload } from "../ImageUpload";
import { StringListField } from "../ListFields";
import { FormSection, SelectField, SwitchField, TextAreaField, TextField } from "../fields";

type Option = { value: string; label: string };

function ProgramCheckboxes({ programs, selected }: { programs: Option[]; selected: string[] }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-[13px] font-medium text-ink">Program yang diajar</legend>
      <div className="flex flex-wrap gap-2">
        {programs.map((p) => (
          <label
            key={p.value}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-medium shadow-soft text-ink has-[:checked]:border-brand-teal has-[:checked]:bg-brand-teal-soft has-[:checked]:text-brand-teal-dark"
          >
            <input type="checkbox" name="programIds[]" value={p.value} defaultChecked={selected.includes(p.value)} className="size-4 accent-[var(--brand-teal)]" />
            {p.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Fields({ item, programs }: { item?: TeacherRow; programs: Option[] }) {
  const e = useFieldError;
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <FormSection title="Profil">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Nama lengkap" name="name" defaultValue={item?.name} placeholder="mis. Ustadzah Hana Salsabila" required error={e("name")} />
          <TextField label="Jabatan / keahlian" name="title" defaultValue={item?.title} placeholder="mis. Pengajar Tahsin & Tahfizh" required error={e("title")} />
          <TextField label="Pendidikan" name="education" defaultValue={item?.education} placeholder="mis. S1 Pendidikan Bahasa Arab" required error={e("education")} />
          <TextField
            label="Lama mengajar (tahun)"
            name="experienceYears"
            type="number"
            min={0}
            max={60}
            defaultValue={item?.experienceYears ?? 1}
            required
            error={e("experienceYears")}
          />
        </div>
        <TextAreaField label="Bio singkat" name="bio" rows={3} maxLength={400} defaultValue={item?.bio} required error={e("bio")} />
        <ProgramCheckboxes programs={programs} selected={item?.programIds ?? []} />
        <StringListField
          name="highlights"
          label="Keunggulan"
          hint="Ditampilkan sebagai label singkat di kartu, maksimal 6."
          defaultValue={item?.highlights ?? []}
          placeholder="mis. Metode talaqqi"
          addLabel="Tambah keunggulan"
          error={e("highlights")}
        />
      </FormSection>

      <FormSection title="Foto" description="Tanpa foto, kartu memakai avatar ilustrasi (berpeci / berhijab) sesuai pilihan di bawah.">
        <ImageUpload name="photo" label="Foto pengajar" folder="pengajar" shape="square" defaultValue={item?.photo ?? ""} hint="Foto persegi, wajah terlihat jelas. Otomatis dikecilkan." error={e("photo")} />
        <SelectField
          label="Avatar ilustrasi"
          name="gender"
          defaultValue={item?.gender ?? "akhwat"}
          options={[
            { value: "akhwat", label: "Akhwat (berhijab)" },
            { value: "ikhwan", label: "Ikhwan (berpeci)" },
          ]}
          error={e("gender")}
        />
      </FormSection>

      <FormSection title="Visibilitas" description="Pengajar yang disembunyikan tetap tersimpan dan bisa ditampilkan lagi kapan saja.">
        <SwitchField name="published" label="Tampilkan di halaman Pengajar" defaultChecked={item?.published ?? true} />
      </FormSection>
    </>
  );
}

export function TeacherForm({ item, programs }: { item?: TeacherRow; programs: Option[] }) {
  return (
    <AdminForm
      action={saveTeacherAction}
      submitLabel={item ? "Simpan perubahan" : "Tambah pengajar"}
      footer={
        <Link href="/admin/pengajar" className="text-sm font-medium text-ink-soft hover:text-ink">
          Batal
        </Link>
      }
    >
      <Fields item={item} programs={programs} />
    </AdminForm>
  );
}
