"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";

export const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink shadow-[0_1px_1px_rgb(16_32_31/0.03)] placeholder:text-ink-soft/60 transition-[border-color,box-shadow] hover:border-ink-soft/30 focus:border-brand-teal focus:outline-none focus:ring-[3px] focus:ring-brand-teal/15 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-400/15";

type FieldShellProps = {
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
  className?: string;
};

/** Label + input + petunjuk + pesan error yang terhubung untuk pembaca layar. */
export function FieldShell({ label, hint, error, required, children, className = "" }: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
          <AlertCircle aria-hidden className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: ReactNode; error?: string; className?: string };

export function TextField({ label, hint, error, className, required, ...props }: TextFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required} className={className}>
      {({ id, describedBy, invalid }) => (
        <input id={id} aria-describedby={describedBy} aria-invalid={invalid} required={required} className={inputClass} {...props} />
      )}
    </FieldShell>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: ReactNode; error?: string; className?: string };

export function TextAreaField({ label, hint, error, className, required, rows = 3, ...props }: TextAreaFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required} className={className}>
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          rows={rows}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          required={required}
          className={`${inputClass} resize-y leading-relaxed`}
          {...props}
        />
      )}
    </FieldShell>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
  options: { value: string; label: string }[];
};

export function SelectField({ label, hint, error, className, required, options, ...props }: SelectFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required} className={className}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <select
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            required={required}
            className={`${inputClass} appearance-none pr-9`}
            {...props}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-soft" />
        </div>
      )}
    </FieldShell>
  );
}

/** Saklar tampil/sembunyi — nilai terkirim "on" bila aktif. */
export function SwitchField({ name, label, description, defaultChecked }: { name: string; label: string; description?: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-3 transition-colors hover:bg-[var(--adm-hover)]">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-ink-soft">{description}</span>}
      </span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-5 w-9 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-brand-teal-strong peer-focus-visible:ring-[3px] peer-focus-visible:ring-brand-teal/25 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4"
      />
    </label>
  );
}

export function FormMessage({ state }: { state: { ok?: boolean; message?: string } }) {
  if (!state.message || state.ok) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
      {state.message}
    </p>
  );
}

export function SuccessText({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-teal-dark">
      <CheckCircle2 aria-hidden className="size-4" />
      {children}
    </span>
  );
}

/**
 * Bagian formulir: judul & keterangan di kiri, isian di dalam kartu di kanan (desktop);
 * bertumpuk di mobile.
 */
export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-b border-line pb-8 last-of-type:border-0 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <div>
        <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
        {description && <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{description}</p>}
      </div>
      <div className="grid gap-5 rounded-xl border border-line bg-surface p-5 shadow-soft">{children}</div>
    </section>
  );
}
