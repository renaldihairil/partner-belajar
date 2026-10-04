"use client";

import { useFormStatus } from "react-dom";
import { Link2, Loader2 } from "lucide-react";
import { createTestimonialLinkAction } from "@/app/admin/actions/testimonial-links";
import { SelectField, TextField } from "../fields";
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

/** Membuat link baru: nama (opsional) + program (opsional). */
export function NewLinkForm({ programs }: { programs: { value: string; label: string }[] }) {
  return (
    <form
      action={createTestimonialLinkAction}
      className="grid items-end gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]"
    >
      <TextField
        label="Nama link"
        name="label"
        maxLength={80}
        placeholder="mis. Orang tua kelas Oktober"
        hint="Hanya untuk catatan Anda, tidak terlihat oleh orang tua."
      />
      <SelectField
        label="Program"
        name="programId"
        defaultValue=""
        options={[{ value: "", label: "Semua program (umum)" }, ...programs]}
        hint="Testimoni yang masuk otomatis dikaitkan ke program ini."
      />
      <div className="md:pb-[26px]">
        <Submit />
      </div>
    </form>
  );
}
