"use client";

import Link from "next/link";
import { startTransition, useActionState, useId, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { submitTestimonialAction } from "@/app/kirim-testimoni/actions";
import type { ActionState } from "@/lib/admin/form";
import { useHydrated } from "@/lib/use-hydrated";
import { StarRatingInput } from "./StarRatingInput";

const MAX_QUOTE = 600;

const inputBase =
  "mt-1.5 w-full rounded-2xl border bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft/70 transition-colors focus:border-brand-teal focus:outline-none focus:ring-4 focus:ring-brand-teal/10";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-red-600 dark:text-red-400">
      <AlertCircle aria-hidden className="size-3.5 shrink-0" />
      {message}
    </p>
  );
}

function Thanks({ onAgain }: { onAgain: () => void }) {
  return (
    <div className="animate-rise flex flex-col items-center px-2 py-6 text-center md:py-10">
      <span className="grid size-20 place-items-center rounded-full bg-brand-teal-soft text-brand-teal-dark">
        <CheckCircle2 aria-hidden className="size-11" strokeWidth={1.75} />
      </span>
      <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">Jazakumullahu khairan</h2>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink-soft">
        Testimoni Anda sudah kami terima dan langsung tampil di website Partner Belajar. Terima kasih sudah berbagi cerita belajar putra-putri Anda.
      </p>
      <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/testimoni"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-teal-strong px-6 text-[15px] font-semibold text-white transition-all hover:brightness-110"
        >
          Lihat semua testimoni
        </Link>
        <button type="button" onClick={onAgain} className="min-h-11 text-sm font-semibold text-brand-teal-dark hover:underline">
          Kirim testimoni lain
        </button>
      </div>
    </div>
  );
}

export function SubmitTestimonialForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(submitTestimonialAction, {});
  const [rating, setRating] = useState(0);
  const [length, setLength] = useState(0);
  const [done, setDone] = useState(false);
  const hydrated = useHydrated();
  const [lastState, setLastState] = useState(state);
  const uid = useId();
  const ratingLabelId = `${uid}-rating`;

  // Tampilkan layar terima kasih begitu server menjawab sukses (set state saat render, cara yang dianjurkan React).
  if (state !== lastState) {
    setLastState(state);
    if (state.ok) setDone(true);
  }

  const errors = state.errors ?? {};

  if (done) {
    return (
      <Thanks
        onAgain={() => {
          setDone(false);
          setRating(0);
          setLength(0);
        }}
      />
    );
  }

  return (
    <form
      method="post"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        // Dikirim manual (bukan action bawaan) agar isian tidak terhapus ketika ada error.
        const data = new FormData(event.currentTarget);
        startTransition(() => formAction(data));
      }}
      className="grid gap-5"
    >
      <input type="hidden" name="token" value={token} />

      {/* Kolom jebakan untuk robot: tidak terlihat oleh manusia. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-parent`} className="text-sm font-semibold text-ink">
            Nama wali <span className="text-red-500">*</span>
          </label>
          <input
            id={`${uid}-parent`}
            name="parent"
            autoComplete="name"
            maxLength={60}
            placeholder="mis. Ibu Aisyah"
            aria-invalid={Boolean(errors.parent)}
            aria-describedby={errors.parent ? `${uid}-parent-err` : undefined}
            className={`${inputBase} ${errors.parent ? "border-red-400" : "border-line"}`}
          />
          <FieldError id={`${uid}-parent-err`} message={errors.parent} />
        </div>
        <div>
          <label htmlFor={`${uid}-child`} className="text-sm font-semibold text-ink">
            Nama anak <span className="text-red-500">*</span>
          </label>
          <input
            id={`${uid}-child`}
            name="child"
            maxLength={60}
            placeholder="mis. Zahra"
            aria-invalid={Boolean(errors.child)}
            aria-describedby={`${uid}-child-hint${errors.child ? ` ${uid}-child-err` : ""}`}
            className={`${inputBase} ${errors.child ? "border-red-400" : "border-line"}`}
          />
          <p id={`${uid}-child-hint`} className="mt-1.5 text-xs text-ink-soft">
            Boleh nama panggilan. Ikut tampil di testimoni.
          </p>
          <FieldError id={`${uid}-child-err`} message={errors.child} />
        </div>
      </div>

      <div>
        <p id={ratingLabelId} className="text-sm font-semibold text-ink">
          Seberapa puas Anda? <span className="text-red-500">*</span>
        </p>
        <div className="mt-1">
          <StarRatingInput name="rating" value={rating} onChange={setRating} invalid={Boolean(errors.rating)} labelledBy={ratingLabelId} />
        </div>
        <FieldError id={`${uid}-rating-err`} message={errors.rating} />
      </div>

      <div>
        <div className="flex items-end justify-between gap-3">
          <label htmlFor={`${uid}-quote`} className="text-sm font-semibold text-ink">
            Testimoni <span className="text-red-500">*</span>
          </label>
          <span aria-hidden className={`text-xs tabular-nums ${length > MAX_QUOTE - 40 ? "text-warn" : "text-ink-soft"}`}>
            {length}/{MAX_QUOTE}
          </span>
        </div>
        <textarea
          id={`${uid}-quote`}
          name="quote"
          rows={5}
          maxLength={MAX_QUOTE}
          onChange={(event) => setLength(event.target.value.length)}
          placeholder="Ceritakan pengalaman belajar anak Anda bersama Partner Belajar…"
          aria-invalid={Boolean(errors.quote)}
          aria-describedby={errors.quote ? `${uid}-quote-err` : undefined}
          className={`${inputBase} resize-y leading-relaxed ${errors.quote ? "border-red-400" : "border-line"}`}
        />
        <FieldError id={`${uid}-quote-err`} message={errors.quote} />
      </div>

      {state.message && !state.ok && !Object.keys(errors).length && (
        <p role="alert" className="flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !hydrated}
        className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-6 text-[16px] font-bold text-on-accent shadow-[0_10px_24px_-10px_rgb(233_169_0/0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#fac93f] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? <Loader2 aria-hidden className="size-5 animate-spin" /> : <Send aria-hidden className="size-5" />}
        {pending ? "Mengirim…" : "Kirim testimoni"}
      </button>

      <p className="flex items-start justify-center gap-1.5 text-center text-xs leading-relaxed text-ink-soft">
        <ShieldCheck aria-hidden className="mt-0.5 size-3.5 shrink-0" />
        Dengan mengirim, Anda setuju testimoni ini ditampilkan di website Partner Belajar.
      </p>
    </form>
  );
}
