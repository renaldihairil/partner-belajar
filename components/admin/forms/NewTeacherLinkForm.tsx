"use client";

import { useFormStatus } from "react-dom";
import { Link2, Loader2 } from "lucide-react";
import { createTeacherLinkAction } from "@/app/admin/actions/teacher-links";
import { PinField } from "../PinField";
import { TextField } from "../fields";
import { buttonPrimary } from "../ui";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${buttonPrimary} w-full md:w-auto`}>
      {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Link2 aria-hidden className="size-4" />}
      {pending ? "Membuat…" : "Buat link"}
    </button>
  );
}

/** Membuat link form guru: nama (opsional) + PIN (opsional; kosong = link terbuka). */
export function NewTeacherLinkForm() {
  return (
    <form action={createTeacherLinkAction} className="grid items-start gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto]">
      <TextField
        label="Nama link"
        name="label"
        maxLength={80}
        placeholder="mis. Pengajar baru Oktober"
        hint="Hanya untuk catatan Anda, tidak terlihat oleh guru."
      />
      <PinField
        label="PIN (opsional)"
        hint="Kosongkan agar link terbuka seperti link testimoni. Bila diisi, guru harus memasukkan PIN ini. Kirim PIN terpisah dari link; PIN tidak bisa dilihat lagi, hanya bisa diganti."
      />
      <div className="md:pt-[26px]">
        <Submit />
      </div>
    </form>
  );
}
