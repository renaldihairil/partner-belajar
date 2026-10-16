"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Video } from "lucide-react";
import { saveDocumentationAction } from "@/app/admin/actions/documentation";
import type { DocumentationRow } from "@/db/schema";
import { youtubeWatchUrl } from "@/lib/youtube";
import { AdminForm, useFieldError } from "../AdminForm";
import { ImageUpload } from "../ImageUpload";
import { YouTubeField } from "../YouTubeField";
import { FormSection, SelectField, SwitchField, TextAreaField, TextField } from "../fields";

type Option = { value: string; label: string };
type MediaType = "video" | "foto";

const categoryOptions: Option[] = ["Kelas Online", "Tatap Muka", "Kegiatan Spesial"].map((c) => ({ value: c, label: c }));

const mediaOptions: { value: MediaType; label: string; note: string; icon: typeof Video }[] = [
  { value: "video", label: "Video", note: "Dari YouTube", icon: Video },
  { value: "foto", label: "Foto", note: "Otomatis 16:9", icon: Camera },
];

function Fields({ item, programs, today }: { item?: DocumentationRow; programs: Option[]; today: string }) {
  const e = useFieldError;
  const [type, setType] = useState<MediaType>(item?.mediaType ?? "video");
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <FormSection title="Jenis" description="Dokumentasi bisa berupa video dari YouTube atau foto. Keduanya tampil seragam (16:9) di galeri.">
        <fieldset>
          <legend className="sr-only">Jenis dokumentasi</legend>
          <div className="grid grid-cols-2 gap-3 sm:max-w-md">
            {mediaOptions.map(({ value, label, note, icon: Icon }) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-soft transition-colors has-[:checked]:border-brand-teal has-[:checked]:bg-brand-teal-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-teal/40"
              >
                <input type="radio" name="mediaType" value={value} checked={type === value} onChange={() => setType(value)} className="sr-only" />
                <Icon aria-hidden className="size-5 text-brand-teal-dark" />
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-ink">{label}</span>
                  <span className="block text-xs text-ink-soft">{note}</span>
                </span>
              </label>
            ))}
          </div>
          {e("mediaType") && <p className="mt-1 text-xs font-medium text-red-600">{e("mediaType")}</p>}
        </fieldset>

        {type === "video" ? (
          <YouTubeField
            name="url"
            label="Tautan YouTube"
            defaultValue={item?.youtubeId ? youtubeWatchUrl(item.youtubeId) : ""}
            error={e("url")}
          />
        ) : (
          <ImageUpload
            name="image"
            label="Foto dokumentasi"
            folder="dokumentasi"
            shape="video"
            required
            defaultValue={item?.image ?? ""}
            hint="Foto yang bukan 16:9 otomatis dipotong di bagian tengah, jadi pastikan objek utama berada di tengah. Pastikan ada izin orang tua bila anak tampil."
            error={e("image")}
          />
        )}
      </FormSection>

      <FormSection title="Keterangan">
        <TextField label="Judul" name="title" defaultValue={item?.title} maxLength={120} required error={e("title")} />
        <TextAreaField
          label="Keterangan singkat"
          name="caption"
          rows={3}
          maxLength={300}
          defaultValue={item?.caption}
          hint="Tampil di jendela pratinjau dan sebagai deskripsi untuk Google."
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

      <FormSection title="Visibilitas" description="Yang disembunyikan tetap tersimpan dan bisa ditampilkan lagi kapan saja.">
        <SwitchField name="published" label="Tampilkan di situs" defaultChecked={item?.published ?? true} />
      </FormSection>
    </>
  );
}

export function DocumentationForm({ item, programs, today }: { item?: DocumentationRow; programs: Option[]; today: string }) {
  return (
    <AdminForm
      action={saveDocumentationAction}
      submitLabel={item ? "Simpan perubahan" : "Tambah dokumentasi"}
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
