"use client";

import { startTransition, useActionState, useId, useState } from "react";
import { AlertCircle, Eye, EyeOff, KeyRound, Loader2, LockKeyhole } from "lucide-react";
import { verifyTeacherPinAction } from "@/app/form-guru/actions";
import type { ActionState } from "@/lib/admin/form";
import { useHydrated } from "@/lib/use-hydrated";

/** Layar masuk PIN: form data guru baru tampil setelah PIN yang benar dimasukkan. */
export function TeacherPinGate({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(verifyTeacherPinAction, {});
  const [show, setShow] = useState(false);
  const hydrated = useHydrated();
  const uid = useId();

  return (
    <form
      method="post"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => formAction(data));
      }}
      className="mx-auto grid max-w-sm gap-5 py-2 text-center"
    >
      <input type="hidden" name="token" value={token} />
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand-teal-soft text-brand-teal-dark">
        <LockKeyhole aria-hidden className="size-8" />
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-ink">Masukkan PIN</h2>
        <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
          Form ini khusus pengajar Partner Belajar. PIN diberikan oleh admin bersama link ini.
        </p>
      </div>

      <div className="text-left">
        <label htmlFor={`${uid}-pin`} className="text-sm font-semibold text-ink">
          PIN
        </label>
        <div className="relative mt-1.5">
          <KeyRound aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-soft" />
          <input
            id={`${uid}-pin`}
            name="pin"
            type={show ? "text" : "password"}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={8}
            autoFocus
            placeholder="4 sampai 8 angka"
            aria-invalid={Boolean(state.message)}
            aria-describedby={state.message ? `${uid}-err` : undefined}
            className={`w-full rounded-2xl border bg-surface py-3.5 pr-12 pl-12 text-center text-xl font-semibold tracking-[0.35em] text-ink placeholder:text-[15px] placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-soft/70 transition-colors focus:border-brand-teal focus:outline-none focus:ring-4 focus:ring-brand-teal/10 ${
              state.message ? "border-red-400" : "border-line"
            }`}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Sembunyikan PIN" : "Tampilkan PIN"}
            className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-xl text-ink-soft transition-colors hover:text-ink"
          >
            {show ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}
          </button>
        </div>
        {state.message && (
          <p id={`${uid}-err`} role="alert" className="mt-2 flex items-start gap-1.5 text-[13px] font-medium text-red-600 dark:text-red-400">
            <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {state.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending || !hydrated}
        className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-teal-strong px-6 text-[16px] font-bold text-white transition-all hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
      >
        {pending && <Loader2 aria-hidden className="size-5 animate-spin" />}
        {pending ? "Memeriksa…" : "Buka form"}
      </button>
    </form>
  );
}
