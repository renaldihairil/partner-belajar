"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import type { ActionState } from "@/lib/admin/form";
import { FormMessage } from "./fields";
import { toast } from "./Toaster";
import { buttonPrimary } from "./ui";

type FormContextValue = { state: ActionState; pending: boolean };
const FormContext = createContext<FormContextValue>({ state: {}, pending: false });

/** Pesan error untuk sebuah field (termasuk error bagian dalam daftar, mis. "pricing.0.price"). */
export function useFieldError(name: string): string | undefined {
  const { errors } = useContext(FormContext).state;
  if (!errors) return undefined;
  if (errors[name]) return errors[name];
  const nested = Object.keys(errors).find((key) => key.startsWith(`${name}.`));
  return nested ? errors[nested] : undefined;
}

type AdminFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  /** Konten tambahan di bilah tombol (mis. tautan batal). */
  footer?: ReactNode;
};

/**
 * Formulir admin dengan server action.
 * - Isian TIDAK dikosongkan ketika ada error validasi (dikirim manual lewat startTransition).
 * - Bilah simpan menempel di bawah & menandai perubahan yang belum disimpan.
 * - Peringatan bila meninggalkan halaman sebelum menyimpan.
 */
export function AdminForm({ action, children, submitLabel = "Simpan", footer }: AdminFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [dirty, setDirty] = useState(false);
  const lastState = useRef(state);

  useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    if (state.ok) {
      setDirty(false);
      if (state.message) toast(state.message);
    } else if (state.message) {
      setDirty(true);
      document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
    }
  }, [state]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  return (
    <FormContext value={{ state, pending }}>
      <form
        className="grid gap-8"
        onInput={() => setDirty(true)}
        onChange={() => setDirty(true)}
        onClick={(event) => {
          // Tombol tambah/hapus/urutkan di daftar juga mengubah isi formulir.
          if ((event.target as HTMLElement).closest("button[type=button]")) setDirty(true);
        }}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          startTransition(() => formAction(data));
          setDirty(false);
        }}
      >
        {children}
        <div className="sticky bottom-0 z-10 -mx-4 border-t border-line bg-surface/90 px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={pending} className={buttonPrimary}>
              {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
              {pending ? "Menyimpan…" : submitLabel}
            </button>
            {footer}
            <span className="ml-auto text-xs text-ink-soft" aria-live="polite">
              {pending ? "" : dirty ? (
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="size-1.5 rounded-full bg-amber-500" />
                  Ada perubahan yang belum disimpan
                </span>
              ) : (
                ""
              )}
            </span>
          </div>
          {state.message && !state.ok && (
            <div className="mt-3">
              <FormMessage state={state} />
            </div>
          )}
        </div>
      </form>
    </FormContext>
  );
}
