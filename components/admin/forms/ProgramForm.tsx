"use client";

import Link from "next/link";
import { saveProgramAction } from "@/app/admin/actions/programs";
import type { ProgramRow } from "@/db/schema";
import { AdminForm, useFieldError } from "../AdminForm";
import { ImageUpload } from "../ImageUpload";
import { RepeaterField, StringListField, type RepeaterFieldDef } from "../ListFields";
import { FormSection, SelectField, SwitchField, TextAreaField, TextField } from "../fields";

const themeOptions = [
  { value: "blue", label: "Biru" },
  { value: "yellow", label: "Kuning" },
  { value: "green", label: "Hijau" },
  { value: "purple", label: "Ungu" },
];

const audienceIcons = [
  { value: "sprout", label: "Tunas (pemula)" },
  { value: "rocket", label: "Roket (berkembang)" },
  { value: "heart", label: "Hati" },
  { value: "users", label: "Orang (kelompok)" },
  { value: "star", label: "Bintang" },
  { value: "shield", label: "Perisai" },
];

const factFields: RepeaterFieldDef[] = [
  { key: "label", label: "Label", placeholder: "mis. Durasi", half: true },
  { key: "value", label: "Isi", placeholder: "mis. 60 menit / pertemuan", half: true },
];

const curriculumFields: RepeaterFieldDef[] = [
  { key: "level", label: "Level", placeholder: "mis. Level 1", half: true },
  { key: "duration", label: "Durasi", placeholder: "mis. 8 pertemuan", half: true },
  { key: "title", label: "Judul modul", placeholder: "mis. Mengenal Huruf & Bunyi" },
  { key: "topics", label: "Materi (satu per baris)", type: "lines", placeholder: "Materi 1" },
];

const audienceFields: RepeaterFieldDef[] = [
  { key: "icon", label: "Ikon", type: "select", options: audienceIcons, half: true },
  { key: "title", label: "Judul", placeholder: "mis. Anak usia 6 sampai 9 tahun", half: true },
  { key: "description", label: "Deskripsi", type: "textarea" },
];

const pricingFields: RepeaterFieldDef[] = [
  { key: "label", label: "Nama paket", placeholder: "mis. 1 Siswa • 1 Pengajar", half: true },
  { key: "price", label: "Harga (Rp)", type: "number", placeholder: "80000", half: true, hint: "Angka saja, tanpa titik." },
  { key: "unit", label: "Satuan", placeholder: "mis. per pertemuan", half: true },
  { key: "popular", label: "Tandai sebagai paket terpopuler", type: "checkbox", half: true },
  { key: "features", label: "Keunggulan paket (satu per baris)", type: "lines" },
];

function BasicFields({ item }: { item?: ProgramRow }) {
  const e = useFieldError;
  return (
    <>
      <FormSection title="Info dasar">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Nama program" name="title" defaultValue={item?.title} placeholder="mis. English Partner" required error={e("title")} />
          <TextField
            label="Alamat halaman"
            name="slug"
            defaultValue={item?.slug}
            placeholder="otomatis dari nama"
            hint={item ? `partnerbelajar.vercel.app/program/${item.slug}. Mengubahnya akan mengubah link yang sudah dibagikan.` : "Kosongkan untuk dibuat otomatis."}
            error={e("slug")}
          />
          <TextField label="Kategori" name="category" defaultValue={item?.category} placeholder="mis. Bahasa" required error={e("category")} />
          <TextField label="Rentang usia" name="ageRange" defaultValue={item?.ageRange} placeholder="mis. 6 sampai 12 tahun" required error={e("ageRange")} />
          <TextField
            label="Kode pendaftaran"
            name="code"
            defaultValue={item?.code}
            placeholder="mis. EN"
            maxLength={3}
            hint="2 sampai 3 huruf, dipakai di kode pesan WhatsApp (PB-EN-XXXX)."
            required
            error={e("code")}
          />
          <SelectField label="Warna kartu" name="theme" defaultValue={item?.theme ?? "blue"} options={themeOptions} error={e("theme")} />
        </div>
        <SwitchField name="published" label="Tampilkan program di situs" defaultChecked={item?.published ?? true} />
      </FormSection>

      <FormSection title="Gambar" description="Sebaiknya ilustrasi karakter berlatar transparan (PNG/WebP).">
        <ImageUpload name="image" label="Gambar program" folder="program" required defaultValue={item?.image ?? ""} error={e("image")} />
        <TextField
          label="Deskripsi gambar"
          name="imageAlt"
          defaultValue={item?.imageAlt}
          placeholder="mis. Ilustrasi anak belajar bahasa Inggris"
          hint="Untuk pembaca layar & SEO."
          required
          error={e("imageAlt")}
        />
      </FormSection>

      <FormSection title="Teks program">
        <TextAreaField label="Deskripsi singkat (kartu)" name="description" rows={2} maxLength={220} defaultValue={item?.description} required error={e("description")} />
        <TextAreaField label="Tagline (hero halaman detail)" name="tagline" rows={2} maxLength={200} defaultValue={item?.tagline} required error={e("tagline")} />
        <TextAreaField label="Deskripsi lengkap" name="longDescription" rows={5} maxLength={1500} defaultValue={item?.longDescription} required error={e("longDescription")} />
        <RepeaterField
          name="facts"
          label="Fakta singkat"
          hint="Tampil di hero halaman detail, mis. Durasi, Metode, Laporan. Maksimal 6."
          fields={factFields}
          defaultValue={item?.facts ?? []}
          newItem={() => ({ label: "", value: "" })}
          itemLabel={(it) => String(it.label || "Fakta baru")}
          addLabel="Tambah fakta"
          error={e("facts")}
        />
      </FormSection>
    </>
  );
}

function ContentFields({ item }: { item?: ProgramRow }) {
  const e = useFieldError;
  return (
    <>
      <FormSection title="Kurikulum">
        <RepeaterField
          name="curriculum"
          label="Modul belajar"
          fields={curriculumFields}
          defaultValue={item?.curriculum ?? []}
          newItem={() => ({ level: "", title: "", duration: "", topics: [] })}
          itemLabel={(it) => String(it.title || "Modul baru")}
          addLabel="Tambah modul"
          error={e("curriculum")}
        />
        <StringListField
          name="outcomes"
          label="Hasil belajar"
          defaultValue={item?.outcomes ?? []}
          placeholder="mis. Berani berbicara bahasa Inggris sederhana"
          addLabel="Tambah hasil belajar"
          error={e("outcomes")}
        />
      </FormSection>

      <FormSection title="Cocok untuk siapa">
        <RepeaterField
          name="audience"
          label="Kelompok peserta"
          fields={audienceFields}
          defaultValue={item?.audience ?? []}
          newItem={() => ({ icon: "sprout", title: "", description: "" })}
          itemLabel={(it) => String(it.title || "Kelompok baru")}
          addLabel="Tambah kelompok"
          error={e("audience")}
        />
      </FormSection>

      <FormSection title="Paket harga">
        <RepeaterField
          name="pricing"
          label="Paket"
          fields={pricingFields}
          defaultValue={item?.pricing ?? []}
          newItem={() => ({ label: "", price: "", unit: "per pertemuan", features: [], popular: false })}
          itemLabel={(it) => String(it.label || "Paket baru")}
          addLabel="Tambah paket"
          error={e("pricing")}
        />
      </FormSection>
    </>
  );
}

export function ProgramForm({ item }: { item?: ProgramRow }) {
  return (
    <AdminForm
      action={saveProgramAction}
      submitLabel={item ? "Simpan perubahan" : "Buat program"}
      footer={
        <Link href="/admin/program" className="text-sm font-medium text-ink-soft hover:text-ink">
          Kembali
        </Link>
      }
    >
      {item && <input type="hidden" name="id" value={item.id} />}
      <BasicFields item={item} />
      <ContentFields item={item} />
    </AdminForm>
  );
}
