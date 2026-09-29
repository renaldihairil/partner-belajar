"use client";

import { createContext, startTransition, useActionState, useContext, type ReactNode } from "react";
import { Loader2, Save } from "lucide-react";
import type { ActionState } from "@/lib/admin/form";
import { FormMessage } from "./fields";

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
  /** Konten tambahan di bilah tombol (mis. tombol batal). */
  footer?: ReactNode;
};

/**
 * Formulir admin dengan server action. Isian TIDAK dikosongkan ketika ada error validasi
 * (form dikirim manual lewat startTransition, bukan reset otomatis bawaan React).
 */
export function AdminForm({ action, children, submitLabel = "Simpan", footer }: AdminFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <FormContext value={{ state, pending }}>
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          startTransition(() => formAction(data));
        }}
      >
        {children}
        <div className="sticky bottom-0 z-10 -mx-4 grid gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <FormMessage state={state} />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-teal-strong px-6 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
            >
              {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Save aria-hidden className="size-4" />}
              {pending ? "Menyimpan…" : submitLabel}
            </button>
            {footer}
          </div>
        </div>
      </form>
    </FormContext>
  );
}
