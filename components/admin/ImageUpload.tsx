"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { uploadImageAction } from "@/app/admin/actions/upload";
import { MAX_IMAGE_BYTES, shrinkImage } from "@/lib/client-image";

type ImageUploadProps = {
  name: string;
  label: string;
  defaultValue?: string;
  folder: "program" | "pengajar" | "testimoni" | "artikel" | "umum";
  hint?: string;
  error?: string;
  shape?: "wide" | "square";
  required?: boolean;
};

export function ImageUpload({ name, label, defaultValue = "", folder, hint, error, shape = "wide", required }: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `${name}-file`;

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      const blob = await shrinkImage(file);
      if (blob.size > MAX_IMAGE_BYTES) throw new Error("Ukuran foto terlalu besar (maks. 4 MB).");
      const data = new FormData();
      data.set("file", blob instanceof File ? blob : new File([blob], "foto.webp", { type: blob.type }));
      data.set("folder", folder);
      const result = await uploadImageAction(data);
      if ("error" in result) setMessage(result.error);
      else setUrl(result.url);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Gagal mengunggah foto.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const box = shape === "square" ? "aspect-square w-36" : "aspect-[4/3] w-full max-w-xs";

  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium text-ink">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </p>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-end gap-4">
        <div className={`relative grid place-items-center overflow-clip rounded-2xl border border-dashed border-line bg-[var(--adm-hover)]/50 ${box}`}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- pratinjau dari domain mana pun (lokal / Blob)
            <img src={url} alt={`Pratinjau ${label}`} className="size-full object-contain" />
          ) : (
            <ImagePlus aria-hidden className="size-8 text-ink-soft/60" />
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-surface/70">
              <Loader2 aria-label="Mengunggah" className="size-6 animate-spin text-brand-teal" />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0])}
            disabled={busy}
          />
          <label
            htmlFor={inputId}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface px-3.5 text-sm font-medium text-ink shadow-soft transition-colors hover:bg-[var(--adm-hover)]"
          >
            <Upload aria-hidden className="size-4" />
            {url ? "Ganti foto" : "Pilih foto"}
          </label>
          {url && !required && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <Trash2 aria-hidden className="size-4" />
              Hapus foto
            </button>
          )}
        </div>
      </div>
      {hint && <p className="mt-1.5 text-xs text-ink-soft">{hint}</p>}
      {(message || error) && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
          {message ?? error}
        </p>
      )}
    </div>
  );
}
