"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { uploadTeacherPhotoAction } from "@/app/form-guru/actions";
import { MAX_IMAGE_BYTES, shrinkImage } from "@/lib/client-image";

/** Pemilih foto untuk form publik guru. Nilai (URL foto) terkirim lewat input tersembunyi bernama `name`. */
export function TeacherPhotoPicker({ name, token, error }: { name: string; token: string; error?: string }) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      const blob = await shrinkImage(file);
      if (blob.size > MAX_IMAGE_BYTES) throw new Error("Ukuran foto terlalu besar (maks. 4 MB).");
      const data = new FormData();
      data.set("file", blob instanceof File ? blob : new File([blob], "foto.webp", { type: blob.type }));
      data.set("token", token);
      const result = await uploadTeacherPhotoAction(data);
      if ("error" in result) setMessage(result.error);
      else setUrl(result.url);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Gagal mengunggah foto.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const problem = message ?? error;

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-4">
        <div className="relative grid size-24 shrink-0 place-items-center overflow-clip rounded-full border-2 border-dashed border-line bg-background">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- pratinjau dari lokal / Blob
            <img src={url} alt="Pratinjau foto Anda" className="size-full object-cover" />
          ) : (
            <Camera aria-hidden className="size-8 text-ink-soft/60" />
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-surface/75">
              <Loader2 aria-label="Mengunggah" className="size-6 animate-spin text-brand-teal" />
            </span>
          )}
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <input
            ref={inputRef}
            id={`${name}-file`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0])}
            disabled={busy}
          />
          <label
            htmlFor={`${name}-file`}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-brand-teal-soft px-4 text-sm font-semibold text-brand-teal-dark transition-colors hover:bg-brand-teal hover:text-white has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-teal/25"
          >
            <Camera aria-hidden className="size-4" />
            {url ? "Ganti foto" : "Pilih foto"}
          </label>
          {url && (
            <button type="button" onClick={() => setUrl("")} className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-red-600 hover:underline">
              <Trash2 aria-hidden className="size-4" />
              Hapus foto
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-soft">Foto wajah yang jelas, rasio persegi lebih baik. Boleh dikosongkan.</p>
      {problem && (
        <p role="alert" className="mt-1.5 text-[13px] font-medium text-red-600 dark:text-red-400">
          {problem}
        </p>
      )}
    </div>
  );
}
