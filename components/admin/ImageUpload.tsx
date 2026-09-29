"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { uploadImageAction } from "@/app/admin/actions/upload";

const MAX_BYTES = 4 * 1024 * 1024;

/** Kecilkan foto di browser dulu (maks. 1600px, WebP) agar upload cepat & di bawah batas ukuran. */
async function shrink(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    // Format yang tidak bisa dibaca browser (mis. HEIC) dikirim apa adanya dan diproses di server.
    return file;
  }
}

type ImageUploadProps = {
  name: string;
  label: string;
  defaultValue?: string;
  folder: "program" | "pengajar" | "testimoni" | "umum";
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
      const blob = await shrink(file);
      if (blob.size > MAX_BYTES) throw new Error("Ukuran foto terlalu besar (maks. 4 MB).");
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
      <p className="mb-1.5 text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </p>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-end gap-4">
        <div className={`relative grid place-items-center overflow-clip rounded-2xl border border-dashed border-line bg-background ${box}`}>
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
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-brand-teal-soft px-4 text-sm font-semibold text-brand-teal-dark transition-colors hover:bg-brand-teal hover:text-white"
          >
            <Upload aria-hidden className="size-4" />
            {url ? "Ganti foto" : "Pilih foto"}
          </label>
          {url && !required && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
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
