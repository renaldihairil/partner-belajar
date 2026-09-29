"use client";

import Link from "next/link";
import { saveDocumentationAction } from "@/app/admin/actions/documentation";
import type { DocumentationRow } from "@/db/schema";
import { youtubeWatchUrl } from "@/lib/youtube";
import { AdminForm, useFieldError } from "../AdminForm";
import { YouTubeField } from "../YouTubeField";
import { FormSection, SelectField, SwitchField, TextAreaField, TextField } from "../fields";

type Option = { value: string; label: string };

const categoryOptions: Option[] = ["Kelas Online", "Tatap Muka", "Kegiatan Spesial"].map((c) => ({ value: c, label: c }));

function Fields({ item, programs, today }: { item?: DocumentationRow; programs: Option[]; today: string }) {
  const e = useFieldError;
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <FormSection title="Video" description="Video ditayangkan langsung dari YouTube, jadi tidak memakai penyimpanan situs.">
        <YouTubeField name="url" label="Tautan YouTube" defaultValue={item ? youtubeWatchUrl(item.youtubeId) : ""} error={e("url")} />
      </FormSection>

      <FormSection title="Keterangan">
        <TextField label="Judul" name="title" defaultValue={item?.title} maxLength={120} required error={e("title")} />
        <TextAreaField
          label="Keterangan singkat"
          name="caption"
          rows={3}
          maxLength={300}
          defaultValue={item?.caption}
          hint="Tampil di jendela pemutar dan sebagai deskripsi video untuk Google."
          required
          error={e("caption")}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Kategori" name="category" defaultValue={item?.category ?? "Kelas Online"} options={categoryOptions} error={e("category")} />
          <TextField label="Tanggal kegiatan" name="date" type="date" defaultValue={item?.date ?? today} required error={e("date")} />
        </div>
        <SelectField
          label="Program terkait"
          name="programId"
          defaultValue={item?.programId ?? ""}
          options={[{ value: "", label: "Tidak spesifik" }, ...programs]}
          error={e("programId")}
        />
      </FormSection>

      <FormSection title="Visibilitas" description="Video yang disembunyikan tetap tersimpan dan bisa ditampilkan lagi kapan saja.">
        <SwitchField name="published" label="Tampilkan di situs" defaultChecked={item?.published ?? true} />
      </FormSection>
    </>
  );
}

export function DocumentationForm({ item, programs, today }: { item?: DocumentationRow; programs: Option[]; today: string }) {
  return (
    <AdminForm
      action={saveDocumentationAction}
      submitLabel={item ? "Simpan perubahan" : "Tambah video"}
      footer={
        <Link href="/admin/dokumentasi" className="text-sm font-medium text-ink-soft hover:text-ink">
          Batal
        </Link>
      }
    >
      <Fields item={item} programs={programs} today={today} />
    </AdminForm>
  );
}
