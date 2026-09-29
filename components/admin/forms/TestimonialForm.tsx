"use client";

import Link from "next/link";
import { saveTestimonialAction } from "@/app/admin/actions/testimonials";
import type { TestimonialRow } from "@/db/schema";
import { AdminForm, useFieldError } from "../AdminForm";
import { FormSection, SelectField, SwitchField, TextAreaField, TextField } from "../fields";

type Option = { value: string; label: string };

export const toneOptions: Option[] = [
  { value: "teal", label: "Hijau toska" },
  { value: "yellow", label: "Kuning" },
  { value: "blue", label: "Biru" },
  { value: "green", label: "Hijau" },
  { value: "purple", label: "Ungu" },
];

const ratingOptions: Option[] = [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} bintang` }));

function Fields({ item, programs }: { item?: TestimonialRow; programs: Option[] }) {
  const e = useFieldError;
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <FormSection title="Pemberi testimoni">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Nama" name="name" defaultValue={item?.name} placeholder="mis. Ibu Aisyah" required error={e("name")} />
          <TextField label="Kota" name="city" defaultValue={item?.city ?? ""} placeholder="mis. Bandung" error={e("city")} />
        </div>
        <TextField label="Keterangan" name="role" defaultValue={item?.role} placeholder="mis. Orang tua siswa English Partner" required error={e("role")} />
      </FormSection>

      <FormSection title="Isi testimoni">
        <TextAreaField
          label="Testimoni"
          name="quote"
          rows={4}
          defaultValue={item?.quote}
          maxLength={600}
          hint="Maksimal 600 karakter. Pastikan sudah mendapat izin dari orang tua untuk ditampilkan."
          required
          error={e("quote")}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Rating" name="rating" defaultValue={String(item?.rating ?? 5)} options={ratingOptions} error={e("rating")} />
          <SelectField
            label="Program"
            name="programId"
            defaultValue={item?.programId ?? ""}
            options={[{ value: "", label: "Tidak spesifik" }, ...programs]}
            error={e("programId")}
          />
          <TextField label="Tanggal" name="date" type="date" defaultValue={item?.date ?? ""} error={e("date")} />
          <SelectField label="Warna kartu" name="tone" defaultValue={item?.tone ?? "teal"} options={toneOptions} error={e("tone")} />
        </div>
        <SwitchField
          name="published"
          label="Tampilkan di situs"
          description="Matikan untuk menyimpan tanpa menampilkan."
          defaultChecked={item?.published ?? true}
        />
      </FormSection>
    </>
  );
}

export function TestimonialForm({ item, programs }: { item?: TestimonialRow; programs: Option[] }) {
  return (
    <AdminForm
      action={saveTestimonialAction}
      submitLabel={item ? "Simpan perubahan" : "Tambah testimoni"}
      footer={
        <Link href="/admin/testimoni" className="text-sm font-semibold text-ink-soft hover:text-ink">
          Batal
        </Link>
      }
    >
      <Fields item={item} programs={programs} />
    </AdminForm>
  );
}
