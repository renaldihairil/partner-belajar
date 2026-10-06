"use client";

import { startTransition, useActionState, useId, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { submitTeacherAction } from "@/app/form-guru/actions";
import type { ActionState } from "@/lib/admin/form";
import { useHydrated } from "@/lib/use-hydrated";
import { TeacherPhotoPicker } from "./TeacherPhotoPicker";

const MAX_BIO = 400;

const inputBase =
  "mt-1.5 w-full rounded-2xl border bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft/70 transition-colors focus:border-brand-teal focus:outline-none focus:ring-4 focus:ring-brand-teal/10";

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line pt-6 first-of-type:border-0 first-of-type:pt-0">
      <div>
        <h2 className="text-[17px] font-extrabold text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-ink-soft">{description}</p>}
      </div>
      {children}
    </section>
  );
}

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
        Data Anda sudah kami terima. Admin akan meninjau terlebih dahulu sebelum profil Anda ditampilkan di website Partner Belajar.
      </p>
      <button type="button" onClick={onAgain} className="mt-7 min-h-11 text-sm font-semibold text-brand-teal-dark hover:underline">
        Isi data pengajar lain
      </button>
    </div>
  );
}

type Program = { id: string; title: string };

export function TeacherSubmitForm({ token, programs }: { token: string; programs: Program[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(submitTeacherAction, {});
  const [bioLength, setBioLength] = useState(0);
  const [done, setDone] = useState(false);
  const hydrated = useHydrated();
  const [round, setRound] = useState(0); // naik setiap "isi lagi" agar seluruh isian dikosongkan
  const [lastState, setLastState] = useState(state);
  const uid = useId();

  // Tampilkan layar terima kasih begitu server menjawab sukses.
  if (state !== lastState) {
    setLastState(state);
    if (state.ok) setDone(true);
  }

  const errors = state.errors ?? {};
  const cls = (name: string) => `${inputBase} ${errors[name] ? "border-red-400" : "border-line"}`;

  if (done) {
    return (
      <Thanks
        onAgain={() => {
          setDone(false);
          setBioLength(0);
          setRound((n) => n + 1);
        }}
      />
    );
  }

  return (
    <form
      key={round}
      method="post"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        // Dikirim manual (bukan action bawaan) agar isian tidak terhapus ketika ada error.
        const data = new FormData(event.currentTarget);
        startTransition(() => formAction(data));
      }}
      className="grid gap-7"
    >
      <input type="hidden" name="token" value={token} />

      {/* Kolom jebakan untuk robot: tidak terlihat oleh manusia. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Section title="Data diri">
        <div>
          <label htmlFor={`${uid}-name`} className="text-sm font-semibold text-ink">
            Nama lengkap <span className="text-red-500">*</span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            maxLength={100}
            placeholder="mis. Ustadzah Hana Salsabila"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={`${uid}-name-hint${errors.name ? ` ${uid}-name-err` : ""}`}
            className={cls("name")}
          />
          <p id={`${uid}-name-hint`} className="mt-1.5 text-xs text-ink-soft">
            Sertakan sapaan bila ada, mis. Ustadz, Ustadzah, atau Kak.
          </p>
          <FieldError id={`${uid}-name-err`} message={errors.name} />
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-ink">
            Jenis kelamin <span className="text-red-500">*</span>
          </legend>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            {[
              { value: "akhwat", label: "Akhwat", note: "Berhijab" },
              { value: "ikhwan", label: "Ikhwan", note: "Berpeci" },
            ].map((g) => (
              <label
                key={g.value}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors has-[:checked]:border-brand-teal has-[:checked]:bg-brand-teal-soft has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-teal/20"
              >
                <input type="radio" name="gender" value={g.value} className="size-4 accent-[var(--brand-teal)]" />
                <span className="leading-tight">
                  <span className="block text-[15px] font-semibold text-ink">{g.label}</span>
                  <span className="block text-xs text-ink-soft">{g.note}</span>
                </span>
              </label>
            ))}
          </div>
          <FieldError id={`${uid}-gender-err`} message={errors.gender} />
        </fieldset>

        <div>
          <label htmlFor={`${uid}-contact`} className="text-sm font-semibold text-ink">
            Nomor WhatsApp atau email
          </label>
          <input
            id={`${uid}-contact`}
            name="contact"
            autoComplete="off"
            maxLength={100}
            placeholder="Opsional"
            aria-describedby={`${uid}-contact-hint`}
            className={cls("contact")}
          />
          <p id={`${uid}-contact-hint`} className="mt-1.5 text-xs text-ink-soft">
            Hanya dilihat admin untuk menghubungi Anda. Tidak ditampilkan di website.
          </p>
          <FieldError id={`${uid}-contact-err`} message={errors.contact} />
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Foto</p>
          <div className="mt-2">
            <TeacherPhotoPicker name="photo" token={token} error={errors.photo} />
          </div>
        </div>
      </Section>

      <Section title="Mengajar di Partner Belajar">
        <fieldset>
          <legend className="text-sm font-semibold text-ink">
            Program yang diajar <span className="text-red-500">*</span>
          </legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {programs.map((p) => (
              <label
                key={p.id}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors has-[:checked]:border-brand-teal has-[:checked]:bg-brand-teal-soft has-[:checked]:text-brand-teal-dark has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-teal/20"
              >
                <input type="checkbox" name="programIds[]" value={p.id} className="size-4 accent-[var(--brand-teal)]" />
                {p.title}
              </label>
            ))}
          </div>
          <FieldError id={`${uid}-programs-err`} message={errors.programIds} />
        </fieldset>

        <div>
          <label htmlFor={`${uid}-title`} className="text-sm font-semibold text-ink">
            Jabatan / keahlian <span className="text-red-500">*</span>
          </label>
          <input id={`${uid}-title`} name="title" maxLength={100} placeholder="mis. Pengajar Tahsin & Tahfizh" aria-invalid={Boolean(errors.title)} className={cls("title")} />
          <FieldError id={`${uid}-title-err`} message={errors.title} />
        </div>

        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_9rem]">
          <div>
            <label htmlFor={`${uid}-education`} className="text-sm font-semibold text-ink">
              Pendidikan terakhir <span className="font-normal text-ink-soft">(opsional)</span>
            </label>
            <input
              id={`${uid}-education`}
              name="education"
              maxLength={150}
              placeholder="mis. S1 Pendidikan Bahasa Arab"
              aria-invalid={Boolean(errors.education)}
              className={cls("education")}
            />
            <FieldError id={`${uid}-education-err`} message={errors.education} />
          </div>
          <div>
            <label htmlFor={`${uid}-exp`} className="text-sm font-semibold text-ink">
              Lama mengajar <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id={`${uid}-exp`}
                name="experienceYears"
                type="number"
                inputMode="numeric"
                min={0}
                max={60}
                defaultValue={1}
                aria-invalid={Boolean(errors.experienceYears)}
                className={`${cls("experienceYears")} pr-14`}
              />
              <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 mt-[3px] -translate-y-1/2 text-sm text-ink-soft">
                tahun
              </span>
            </div>
            <FieldError id={`${uid}-exp-err`} message={errors.experienceYears} />
          </div>
        </div>
      </Section>

      <Section title="Tentang Anda" description="Ditampilkan di kartu profil pengajar pada website.">
        <div>
          <div className="flex items-end justify-between gap-3">
            <label htmlFor={`${uid}-bio`} className="text-sm font-semibold text-ink">
              Bio singkat <span className="text-red-500">*</span>
            </label>
            <span aria-hidden className={`text-xs tabular-nums ${bioLength > MAX_BIO - 30 ? "text-warn" : "text-ink-soft"}`}>
              {bioLength}/{MAX_BIO}
            </span>
          </div>
          <textarea
            id={`${uid}-bio`}
            name="bio"
            rows={4}
            maxLength={MAX_BIO}
            onChange={(event) => setBioLength(event.target.value.length)}
            placeholder="mis. Sabar membimbing anak dari mengenal huruf hingga lancar tilawah."
            aria-invalid={Boolean(errors.bio)}
            className={`${cls("bio")} resize-y leading-relaxed`}
          />
          <FieldError id={`${uid}-bio-err`} message={errors.bio} />
        </div>
        <div>
          <label htmlFor={`${uid}-hl`} className="text-sm font-semibold text-ink">
            Keunggulan
          </label>
          <textarea
            id={`${uid}-hl`}
            name="highlights"
            rows={3}
            placeholder={"Metode talaqqi\nMurajaah menyenangkan"}
            aria-describedby={`${uid}-hl-hint`}
            aria-invalid={Boolean(errors.highlights)}
            className={`${cls("highlights")} resize-y leading-relaxed`}
          />
          <p id={`${uid}-hl-hint`} className="mt-1.5 text-xs text-ink-soft">
            Opsional. Tulis satu per baris, maksimal 6 (masing-masing singkat).
          </p>
          <FieldError id={`${uid}-hl-err`} message={errors.highlights} />
        </div>
      </Section>

      {state.message && !state.ok && (
        <p role="alert" className="flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      )}

      <div className="grid gap-3">
        <button
          type="submit"
          disabled={pending || !hydrated}
          className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-6 text-[16px] font-bold text-on-accent shadow-[0_10px_24px_-10px_rgb(233_169_0/0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#fac93f] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? <Loader2 aria-hidden className="size-5 animate-spin" /> : <Send aria-hidden className="size-5" />}
          {pending ? "Mengirim…" : "Kirim data"}
        </button>
        <p className="flex items-start justify-center gap-1.5 text-center text-xs leading-relaxed text-ink-soft">
          <ShieldCheck aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          Data dan foto Anda akan ditinjau admin sebelum ditampilkan di website Partner Belajar.
        </p>
      </div>
    </form>
  );
}
