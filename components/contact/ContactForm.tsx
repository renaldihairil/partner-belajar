"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { programs } from "@/data/programs";
import { siteConfig } from "@/lib/site-config";
import { createRef, deviceType, getAttribution, sendLead } from "@/lib/tracking";
import { buildWhatsappMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Lead } from "@/types";

type Fields = { name: string; whatsapp: string; program: string; message: string; website: string };
type Errors = Partial<Record<keyof Fields, string>>;

const PHONE_RE = /^\+?[\d\s-]{9,16}$/;

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (fields.name.trim().length < 2) errors.name = "Nama minimal 2 karakter.";
  if (fields.whatsapp.trim() && !PHONE_RE.test(fields.whatsapp.trim())) {
    errors.whatsapp = "Nomor WhatsApp tidak valid.";
  }
  if (fields.message.trim().length < 10) errors.message = "Pesan minimal 10 karakter.";
  return errors;
}

const inputClass =
  "mt-1.5 w-full rounded-2xl border bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft/70 transition-colors focus:border-brand-teal focus:outline-none focus:ring-4 focus:ring-brand-teal/10";

/**
 * Pertanyaan umum → WhatsApp admin. Data juga dicatat ke /api/leads (jenis "tanya")
 * sehingga admin bisa mencocokkan pesan lewat kode di akhir pesan.
 */
export function ContactForm() {
  const searchParams = useSearchParams();
  const initialProgram = programs.find((p) => p.slug === searchParams.get("program"))?.slug ?? "";

  const [fields, setFields] = useState<Fields>({ name: "", whatsapp: "", program: initialProgram, message: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sentRef, setSentRef] = useState<string | null>(null);

  const update = (key: keyof Fields) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }

    const program = programs.find((p) => p.slug === fields.program);
    const lead: Lead = {
      ref: createRef(program?.code ?? "CT"),
      intent: "tanya",
      programTitle: program?.title,
      parentName: fields.name.trim(),
      whatsapp: fields.whatsapp.trim() || undefined,
      notes: fields.message.trim(),
      ...getAttribution(),
      pagePath: window.location.pathname,
      device: deviceType(),
    };

    sendLead({ ...lead, website: fields.website });
    const url = whatsappUrl(buildWhatsappMessage(lead));
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    else window.location.href = url;
    setSentRef(lead.ref);
  }

  const errorId = (key: keyof Fields) => (errors[key] ? `error-${key}` : undefined);
  const borderFor = (key: keyof Fields) => (errors[key] ? "border-red-400" : "border-line");

  return (
    <form id="kirim-pesan" noValidate onSubmit={handleSubmit} className="relative scroll-mt-6" aria-labelledby="form-title">
      <h2 id="form-title" className="text-lg font-bold text-ink md:text-xl">
        Kirim Pesan via WhatsApp
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Tulis pertanyaan Anda, lalu lanjutkan di WhatsApp. Admin kami akan membalas secepatnya.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="field-name" className="text-sm font-medium text-ink">
            Nama lengkap
          </label>
          <input
            id="field-name"
            name="name"
            autoComplete="name"
            value={fields.name}
            onChange={(e) => update("name")(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errorId("name")}
            placeholder="Nama Anda"
            className={`${inputClass} ${borderFor("name")}`}
          />
          {errors.name && <FieldError id="error-name">{errors.name}</FieldError>}
        </div>

        <div>
          <label htmlFor="field-whatsapp" className="text-sm font-medium text-ink">
            No. WhatsApp <span className="font-normal text-ink-soft">(opsional)</span>
          </label>
          <input
            id="field-whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            value={fields.whatsapp}
            onChange={(e) => update("whatsapp")(e.target.value)}
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={errorId("whatsapp")}
            placeholder="0812..."
            className={`${inputClass} ${borderFor("whatsapp")}`}
          />
          {errors.whatsapp && <FieldError id="error-whatsapp">{errors.whatsapp}</FieldError>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="field-program" className="text-sm font-medium text-ink">
            Program yang diminati <span className="font-normal text-ink-soft">(opsional)</span>
          </label>
          <select
            id="field-program"
            name="program"
            value={fields.program}
            onChange={(e) => update("program")(e.target.value)}
            className={`${inputClass} border-line`}
          >
            <option value="">Belum tahu / pertanyaan umum</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="field-message" className="text-sm font-medium text-ink">
            Pesan
          </label>
          <textarea
            id="field-message"
            name="message"
            rows={4}
            value={fields.message}
            onChange={(e) => update("message")(e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errorId("message")}
            placeholder="Ceritakan kebutuhan belajar anak Anda..."
            className={`${inputClass} resize-y ${borderFor("message")}`}
          />
          {errors.message && <FieldError id="error-message">{errors.message}</FieldError>}
        </div>

        {/* Honeypot anti-bot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={fields.website} onChange={(e) => update("website")(e.target.value)} />
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1faf55] px-6 text-base font-semibold text-white shadow-[0_12px_24px_-14px_rgb(31_175_85/0.95)] transition-all hover:-translate-y-0.5 hover:bg-[#1a9c4b]"
      >
        <MessageCircle aria-hidden className="size-5" />
        Kirim via WhatsApp
      </button>

      <p role="status" className="mt-3 min-h-5 text-center text-sm text-ink-soft">
        {sentRef ? (
          <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
            <CheckCircle2 aria-hidden className="size-4 text-brand-teal" />
            WhatsApp dibuka (kode {sentRef}). Belum terbuka?
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-teal-dark underline">
              Chat {siteConfig.contact.phone}
            </a>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs">
            <ShieldCheck aria-hidden className="size-3.5 text-brand-teal" />
            Data hanya dipakai untuk membalas pesan Anda.
          </span>
        )}
      </p>
    </form>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="mt-1.5 text-[13px] text-red-700">
      {children}
    </p>
  );
}
