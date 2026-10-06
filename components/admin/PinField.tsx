"use client";

import { useId, useState } from "react";
import { Dices } from "lucide-react";
import { inputClass } from "./fields";

/** PIN 6 angka acak (memakai pengacak aman milik browser). */
function randomPin(): string {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return String(buffer[0] % 1_000_000).padStart(6, "0");
}

/**
 * Isian PIN 4–8 angka (boleh kosong bila `required` false) + tombol "Acak". PIN sengaja ditampilkan (bukan titik-titik)
 * supaya admin bisa langsung mencatat dan mengirimkannya ke guru.
 */
export function PinField({
  label = "PIN",
  hint,
  name = "pin",
  required = false,
}: {
  label?: string;
  hint?: string;
  name?: string;
  required?: boolean;
}) {
  const id = useId();
  const [value, setValue] = useState("");
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value.replace(/\D/g, "").slice(0, 8))}
          inputMode="numeric"
          autoComplete="off"
          pattern="\d{4,8}"
          minLength={4}
          maxLength={8}
          required={required}
          placeholder="4 sampai 8 angka"
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${inputClass} font-mono tracking-[0.2em]`}
        />
        <button
          type="button"
          onClick={() => setValue(randomPin())}
          className="inline-flex h-[38px] shrink-0 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-[13px] font-medium text-ink shadow-soft transition-colors hover:bg-[var(--adm-hover)]"
        >
          <Dices aria-hidden className="size-4" />
          Acak
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
}
