"use client";

import Link from "next/link";
import { saveClassAction } from "@/app/admin/actions/programs";
import type { ProgramClassRow } from "@/db/schema";
import { AdminForm, useFieldError } from "../AdminForm";
import { FormSection, SelectField, SwitchField, TextField } from "../fields";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"];

function DayPicker({ selected, error }: { selected: string[]; error?: string }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-[13px] font-medium text-ink">
        Hari belajar <span className="text-red-500">*</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => (
          <label
            key={day}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-medium shadow-soft text-ink has-[:checked]:border-brand-teal has-[:checked]:bg-brand-teal-soft has-[:checked]:text-brand-teal-dark"
          >
            <input type="checkbox" name="days[]" value={day} defaultChecked={selected.includes(day)} className="size-4 accent-[var(--brand-teal)]" />
            {day}
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </fieldset>
  );
}

function Fields({ item }: { item?: ProgramClassRow }) {
  const e = useFieldError;
  return (
    <>
      <FormSection title="Kelas">
        <TextField label="Nama kelas" name="name" defaultValue={item?.name} placeholder="mis. Kelas Reguler Sore" required error={e("name")} />
        <TextField label="Catatan" name="note" defaultValue={item?.note ?? ""} placeholder="mis. Level pemula, usia 6 sampai 9 tahun" error={e("note")} />
      </FormSection>

      <FormSection title="Jadwal & tempat">
        <DayPicker selected={item?.days ?? []} error={e("days")} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Jam" name="time" defaultValue={item?.time} placeholder="mis. 16.00 sampai 17.00 WIB" required error={e("time")} />
          <SelectField
            label="Mode"
            name="mode"
            defaultValue={item?.mode ?? "online"}
            options={[
              { value: "online", label: "Online" },
              { value: "offline", label: "Tatap muka" },
              { value: "hybrid", label: "Hybrid" },
            ]}
            error={e("mode")}
          />
        </div>
        <TextField label="Lokasi" name="location" defaultValue={item?.location ?? ""} placeholder="Wajib untuk tatap muka / hybrid" error={e("location")} />
      </FormSection>

      <FormSection
        title="Pendaftaran & kuota"
        description="Pendaftaran kelas dibuka setiap hari. Status dihitung otomatis: Dibuka, Penuh (bila kuota terisi), atau Ditutup (bila Anda menutupnya)."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Kuota kursi"
            name="quota"
            type="number"
            min={0}
            defaultValue={item?.quota ?? 0}
            hint="Isi 0 bila jumlah peserta tidak dibatasi."
            required
            error={e("quota")}
          />
          <TextField
            label="Sudah terdaftar"
            name="enrolled"
            type="number"
            min={0}
            defaultValue={item?.enrolled ?? 0}
            hint="Perbarui setiap ada siswa yang mendaftar. Diabaikan bila kuota 0."
            required
            error={e("enrolled")}
          />
        </div>
        <SwitchField
          name="manuallyClosed"
          label="Tutup pendaftaran kelas ini sementara"
          description="Status menjadi Ditutup walaupun kuota masih tersedia. Matikan untuk membuka lagi."
          defaultChecked={item?.manuallyClosed ?? false}
        />
      </FormSection>
    </>
  );
}

export function ClassForm({ programId, item }: { programId: string; item?: ProgramClassRow }) {
  return (
    <AdminForm
      action={saveClassAction}
      submitLabel={item ? "Simpan perubahan" : "Tambah kelas"}
      footer={
        <Link href={`/admin/program/${programId}/kelas`} className="text-sm font-medium text-ink-soft hover:text-ink">
          Batal
        </Link>
      }
    >
      <input type="hidden" name="programId" value={programId} />
      {item && <input type="hidden" name="id" value={item.id} />}
      <Fields item={item} />
    </AdminForm>
  );
}
