"use client";

import Link from "next/link";
import { saveArticleAction } from "@/app/admin/actions/articles";
import type { ArticleRow } from "@/db/schema";
import { articleCategories } from "@/lib/articles";
import { AdminForm, useFieldError } from "../AdminForm";
import { ArticleBlocksField } from "../ArticleBlocksField";
import { SeoPreview } from "../SeoPreview";
import { ImageUpload } from "../ImageUpload";
import { StringListField } from "../ListFields";
import { FormSection, SelectField, SwitchField, TextAreaField, TextField } from "../fields";

type SiteInfo = { siteUrl: string; siteName: string };

function Fields({ item, today, siteUrl, siteName }: { item?: ArticleRow; today: string } & SiteInfo) {
  const e = useFieldError;
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <FormSection title="Judul & ringkasan">
        <TextField label="Judul artikel" name="title" defaultValue={item?.title} maxLength={150} required error={e("title")} />
        <TextAreaField
          label="Ringkasan"
          name="excerpt"
          rows={3}
          maxLength={300}
          defaultValue={item?.excerpt}
          hint="Tampil di kartu artikel dan jadi deskripsi di Google. Ideal 70–160 karakter."
          required
          error={e("excerpt")}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Kategori" name="category" defaultValue={item?.category ?? articleCategories[0]} options={articleCategories.map((c) => ({ value: c, label: c }))} error={e("category")} />
          <TextField label="Tanggal terbit" name="date" type="date" defaultValue={item?.date ?? today} required error={e("date")} />
        </div>
        <TextField
          label="Alamat halaman (slug)"
          name="slug"
          defaultValue={item?.slug ?? ""}
          placeholder="dikosongkan = otomatis dari judul"
          hint={item ? "Mengubah alamat membuat tautan lama artikel ini tidak berlaku." : "Huruf kecil dan tanda hubung, mis. tips-belajar-di-rumah."}
          error={e("slug")}
        />
      </FormSection>

      <FormSection title="Isi artikel" description="Susun dari blok: paragraf, subjudul (muncul di daftar isi), daftar poin, dan kotak tips.">
        <ArticleBlocksField name="content" label="Isi" defaultValue={item?.content} error={e("content")} />
      </FormSection>

      <FormSection title="Gambar sampul">
        <ImageUpload name="image" label="Gambar sampul" folder="artikel" defaultValue={item?.image ?? ""} hint="Rasio 16:10 paling pas. Otomatis dikecilkan." required error={e("image")} />
        <TextField label="Deskripsi gambar" name="imageAlt" defaultValue={item?.imageAlt} placeholder="mis. Anak belajar membaca bersama ibu" hint="Untuk pembaca layar dan SEO." required error={e("imageAlt")} />
      </FormSection>

      <FormSection title="Penulis & tag">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Nama penulis" name="authorName" defaultValue={item?.authorName ?? "Tim Partner Belajar"} required error={e("authorName")} />
          <TextField label="Jabatan penulis" name="authorRole" defaultValue={item?.authorRole ?? "Redaksi"} required error={e("authorRole")} />
        </div>
        <StringListField name="tags" label="Tag" hint="Maksimal 8, huruf kecil." defaultValue={item?.tags ?? []} placeholder="mis. belajar di rumah" addLabel="Tambah tag" error={e("tags")} />
      </FormSection>

      <FormSection title="Pratinjau Google (SEO)" description="Begini artikel akan tampil di hasil pencarian Google. Judul dan ringkasan yang jelas membantu artikel ditemukan.">
        <SeoPreview siteUrl={siteUrl} siteName={siteName} />
      </FormSection>

      <FormSection title="Publikasi">
        <SwitchField name="published" label="Terbitkan di situs" description="Matikan untuk menyimpan sebagai draf." defaultChecked={item?.published ?? true} />
        <SwitchField name="featured" label="Jadikan artikel pilihan" description="Tampil besar di atas halaman Artikel. Hanya satu artikel yang bisa jadi pilihan." defaultChecked={item?.featured ?? false} />
      </FormSection>
    </>
  );
}

export function ArticleForm({ item, today, siteUrl, siteName }: { item?: ArticleRow; today: string } & SiteInfo) {
  return (
    <AdminForm
      action={saveArticleAction}
      submitLabel={item ? "Simpan perubahan" : "Tambah artikel"}
      footer={
        <Link href="/admin/artikel" className="text-sm font-medium text-ink-soft hover:text-ink">
          Batal
        </Link>
      }
    >
      <Fields item={item} today={today} siteUrl={siteUrl} siteName={siteName} />
    </AdminForm>
  );
}
