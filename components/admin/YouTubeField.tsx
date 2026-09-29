"use client";

import { useState } from "react";
import { parseYouTubeId, youtubeThumbnail } from "@/lib/youtube";
import { FieldShell, inputClass } from "./fields";

/** Isian tautan YouTube dengan pratinjau gambar mini langsung. Terkirim sebagai `${name}`. */
export function YouTubeField({ name, label, defaultValue = "", error }: { name: string; label: string; defaultValue?: string; error?: string }) {
  const [value, setValue] = useState(defaultValue);
  const id = parseYouTubeId(value);

  return (
    <FieldShell
      label={label}
      required
      error={error}
      hint="Tempel tautan video YouTube (youtu.be/… atau youtube.com/watch?v=…). Video harus berstatus Publik atau Tidak Publik agar bisa diputar."
    >
      {({ id: fieldId, describedBy, invalid }) => (
        <div className="grid gap-3">
          <input
            id={fieldId}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://youtu.be/…"
            inputMode="url"
            autoComplete="off"
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={inputClass}
          />
          <div className="relative aspect-video w-full max-w-sm overflow-clip rounded-xl bg-[var(--adm-hover)] ring-1 ring-line">
            {id ? (
              // eslint-disable-next-line @next/next/no-img-element -- pratinjau langsung dari YouTube
              <img src={youtubeThumbnail(id)} alt="Pratinjau video" className="absolute inset-0 size-full object-cover" />
            ) : (
              <span className="absolute inset-0 grid place-items-center px-4 text-center text-xs text-ink-soft">
                {value.trim() ? "Tautan belum dikenali sebagai video YouTube." : "Pratinjau video akan tampil di sini."}
              </span>
            )}
          </div>
        </div>
      )}
    </FieldShell>
  );
}
