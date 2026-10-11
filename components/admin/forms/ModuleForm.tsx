"use client";

import Link from "next/link";
import { saveModuleAction } from "@/app/admin/actions/modules";
import type { LearningModuleRow } from "@/db/schema";
import { AdminForm, useFieldError } from "../AdminForm";
import { ImageUpload } from "../ImageUpload";
import { FormSection, SelectField, SwitchField, TextAreaField, TextField } from "../fields";

type Option = { value: string; label: string };

function Fields({ item, programs }: { item?: LearningModuleRow; programs: Option[] }) {
  const e = useFieldError;
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <FormSection title="Kitab / buku">
        <TextField
          label="Nama kitab"
          name="title"
          defaultValue={item?.title}
          maxLength={120}
          placeholder="mis. Matan Al-Ajurrumiyyah"
          required
          error={e("title")}
        />
        <TextAreaField
          label="Deskripsi singkat"
          name="description"
          rows={3}
          maxLength={300}
          defaultValue={item?.description}
          hint="Dua sampai tiga kalimat: isi kitab dan untuk siapa. Tampil di kartu modul."
          required
          error={e("description")}
        />
        <SelectField
          label="Program terkait"
          name="programId"
          defaultValue={item?.programId ?? ""}
          options={[{ value: "", label: "Tidak spesifik" }, ...programs]}
          error={e("programId")}
        />
      </FormSection>

      <FormSection title="Sampul" description="Tampil persegi (1:1) di kartu. Tanpa sampul, kartu memakai gambar ilustrasi.">
        <ImageUpload
          name="cover"
          label="Foto sampul"
          folder="modul"
          shape="square"
          defaultValue={item?.cover ?? ""}
          hint="Foto yang bukan persegi otomatis dipotong di bagian tengah, jadi pastikan judul pada sampul tidak terpotong."
          error={e("cover")}
        />
      </FormSection>

      <FormSection title="Unduhan" description="Tombol Download di kartu membuka tautan ini di tab baru.">
        <TextField
          label="Tautan unduh"
          name="downloadUrl"
          defaultValue={item?.downloadUrl}
          maxLength={1000}
          placeholder="https://drive.google.com/file/d/..."
          hint="Alamat halaman web tempat file bisa diunduh (Google Drive, Dropbox, dll.)."
          required
          error={e("downloadUrl")}
        />
      </FormSection>

      <FormSection title="Visibilitas" description="Modul yang disembunyikan tetap tersimpan dan bisa ditampilkan lagi kapan saja.">
        <SwitchField name="published" label="Tampilkan di halaman Modul Belajar" defaultChecked={item?.published ?? true} />
      </FormSection>
    </>
  );
}

export function ModuleForm({ item, programs }: { item?: LearningModuleRow; programs: Option[] }) {
  return (
    <AdminForm
      action={saveModuleAction}
      submitLabel={item ? "Simpan perubahan" : "Tambah modul"}
      footer={
        <Link href="/admin/modul" className="text-sm font-medium text-ink-soft hover:text-ink">
          Batal
        </Link>
      }
    >
      <Fields item={item} programs={programs} />
    </AdminForm>
  );
}
