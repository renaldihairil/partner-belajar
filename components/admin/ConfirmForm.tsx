"use client";

import type { ReactNode } from "react";

/** Form server action yang meminta konfirmasi dulu (untuk tindakan menghapus). */
export function ConfirmForm({ action, message, children }: { action: (formData: FormData) => void | Promise<void>; message: string; children: ReactNode }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
