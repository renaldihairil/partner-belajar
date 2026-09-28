"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Copy, MessageCircle, ShieldCheck, X } from "lucide-react";
import { getClassStatus, statusLabel } from "@/lib/class-status";
import { formatDateId, formatDays } from "@/lib/format";
import { createRef, deviceType, getAttribution, guessSource, sendLead } from "@/lib/tracking";
import { buildWhatsappMessage, formatRupiah, whatsappUrl } from "@/lib/whatsapp";
import type { Lead, LeadIntent, ProgramWithClasses, RegistrationStatus } from "@/types";
import type { RegistrationRequest } from "./RegistrationProvider";

const SOURCES = ["Instagram", "TikTok", "Facebook", "YouTube", "Google", "WhatsApp", "Teman / keluarga", "Sekolah", "Lainnya"];
const AGES = Array.from({ length: 12 }, (_, i) => String(i + 4)); // 4–15 tahun

const intentByStatus: Record<RegistrationStatus, LeadIntent> = {
  open: "daftar",
  upcoming: "ingatkan",
  full: "tunggu",
  closed: "info",
};

const titles: Record<LeadIntent, string> = {
  daftar: "Daftar Kelas",
  ingatkan: "Ingatkan Saya",
  tunggu: "Masuk Daftar Tunggu",
  info: "Tanya Batch Berikutnya",
  tanya: "Daftar / Konsultasi",
};

type Fields = {
  programSlug: string;
  classId: string;
  planId: string;
  parentName: string;
  childName: string;
  childAge: string;
  city: string;
  source: string;
  notes: string;
  website: string; // honeypot
};

type Errors = Partial<Record<keyof Fields, string>>;

type RegistrationDialogProps = {
  programs: ProgramWithClasses[];
  request: RegistrationRequest | null;
  onClose: () => void;
};

export function RegistrationDialog({ programs, request, onClose }: RegistrationDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [now] = useState(() => Date.now());
  const initialProgram = programs.find((p) => p.slug === request?.programSlug);

  const [fields, setFields] = useState<Fields>(() => ({
    programSlug: initialProgram?.slug ?? "",
    classId: request?.classId ?? "",
    planId: request?.planId ?? initialProgram?.pricing.find((p) => p.popular)?.id ?? "",
    parentName: "",
    childName: "",
    childAge: "",
    city: "",
    source: "",
    notes: "",
    website: "",
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<{ ref: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (request && !dialog.open) dialog.showModal();
    if (!request && dialog.open) dialog.close();
  }, [request]);

  // Isi otomatis "Tahu dari mana" dari UTM/referrer bila ada.
  useEffect(() => {
    if (!request) return;
    const guessed = guessSource(getAttribution());
    if (guessed) setFields((prev) => (prev.source ? prev : { ...prev, source: guessed }));
  }, [request]);

  const program = programs.find((p) => p.slug === fields.programSlug);
  const classes = useMemo(
    () => (program?.classes ?? []).map((item) => ({ item, status: getClassStatus(item, now) })),
    [program, now],
  );
  const selectedClass = classes.find((c) => c.item.id === fields.classId);
  const plan = program?.pricing.find((p) => p.id === fields.planId);
  const intent: LeadIntent = !program
    ? "tanya"
    : selectedClass
      ? intentByStatus[selectedClass.status]
      : (request?.intent ?? "daftar");

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function changeProgram(slug: string) {
    const next = programs.find((p) => p.slug === slug);
    setFields((prev) => ({
      ...prev,
      programSlug: slug,
      classId: "",
      planId: next?.pricing.find((p) => p.popular)?.id ?? "",
    }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (fields.parentName.trim().length < 2) e.parentName = "Isi nama Anda (minimal 2 huruf).";
    if (fields.childName.trim().length < 2) e.childName = "Isi nama anak (minimal 2 huruf).";
    if (!fields.childAge) e.childAge = "Pilih usia anak.";
    if (fields.city.trim().length < 2) e.city = "Isi kota/domisili.";
    return e;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`reg-${firstInvalid}`)?.focus();
      return;
    }

    const attribution = getAttribution();
    const classItem = selectedClass?.item;
    const lead: Lead = {
      ref: createRef(program?.code ?? "UM"),
      intent,
      programTitle: program?.title,
      className: classItem
        ? `${classItem.name} (mulai ${formatDateId(classItem.classStarts)}, ${formatDays(classItem.days)} ${classItem.time})`
        : program
          ? "Belum menentukan — mohon rekomendasi jadwal"
          : undefined,
      planLabel: plan ? `${plan.label} — ${formatRupiah(plan.price)} ${plan.unit}` : undefined,
      parentName: fields.parentName.trim(),
      childName: fields.childName.trim(),
      childAge: fields.childAge,
      city: fields.city.trim(),
      source: fields.source || undefined,
      notes: fields.notes.trim() || undefined,
      ...attribution,
      pagePath: window.location.pathname,
      device: deviceType(),
    };

    sendLead({ ...lead, website: fields.website });
    const url = whatsappUrl(buildWhatsappMessage(lead));
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    else window.location.href = url;
    setDone({ ref: lead.ref, url });
  }

  const inputClass = (key: keyof Fields) =>
    `mt-1.5 w-full rounded-2xl border bg-surface px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/70 transition-colors focus:border-brand-teal focus:outline-none focus:ring-4 focus:ring-brand-teal/10 ${
      errors[key] ? "border-red-400" : "border-line"
    }`;

  return (
    <dialog
      ref={ref}
      aria-labelledby="reg-title"
      className="sheet-dialog"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      {request && (
        <>
          <header className="relative shrink-0 border-b border-line bg-[linear-gradient(120deg,var(--soft-cream),var(--surface)_45%,var(--brand-teal-soft))] px-5 pt-5 pb-4 sm:px-7">
            <p className="text-xs font-semibold tracking-wide text-brand-teal uppercase">Pendaftaran via WhatsApp</p>
            <h2 id="reg-title" className="mt-1 pr-12 text-xl font-extrabold text-ink sm:text-2xl">
              {done ? "Pesan siap dikirim" : `${titles[intent]}${program ? ` · ${program.title}` : ""}`}
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Tutup formulir"
              className="absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-panel text-ink shadow-soft transition-colors hover:bg-surface"
            >
              <X aria-hidden className="size-5" />
            </button>
          </header>

          {done ? (
            <div className="overflow-y-auto px-5 py-8 text-center sm:px-8">
              <CheckCircle2 aria-hidden className="mx-auto size-14 text-status-open" />
              <p className="mt-4 text-[15px] text-ink">
                WhatsApp sudah dibuka dengan pesan pendaftaran Anda. Tinggal tekan <strong>Kirim</strong> di WhatsApp.
              </p>
              <div className="mx-auto mt-5 inline-flex items-center gap-3 rounded-2xl bg-brand-teal-soft px-4 py-3">
                <span className="text-left">
                  <span className="block text-xs text-ink-soft">Kode pendaftaran</span>
                  <span className="font-mono text-lg font-bold tracking-wider text-brand-teal-dark">{done.ref}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(done.ref).then(() => setCopied(true), () => undefined);
                  }}
                  className="grid size-10 place-items-center rounded-xl bg-surface text-brand-teal-dark shadow-soft"
                  aria-label="Salin kode pendaftaran"
                >
                  {copied ? <CheckCircle2 aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
                </button>
              </div>
              <p className="mt-5 text-sm text-ink-soft">WhatsApp tidak terbuka?</p>
              <a
                href={done.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1faf55] px-6 font-semibold text-white shadow-[0_10px_20px_-12px_rgb(31_175_85/0.9)] transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle aria-hidden className="size-5" />
                Buka WhatsApp lagi
              </a>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="grid gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2 sm:px-7">
                <div className="sm:col-span-2">
                  <label htmlFor="reg-programSlug" className="text-sm font-semibold text-ink">
                    Program
                  </label>
                  <select
                    id="reg-programSlug"
                    value={fields.programSlug}
                    onChange={(e) => changeProgram(e.target.value)}
                    className={inputClass("programSlug")}
                  >
                    <option value="">Belum tahu — ingin konsultasi dulu</option>
                    {programs.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                {program && (
                  <div className="sm:col-span-2">
                    <label htmlFor="reg-classId" className="text-sm font-semibold text-ink">
                      Jadwal kelas
                    </label>
                    <select
                      id="reg-classId"
                      value={fields.classId}
                      onChange={(e) => set("classId", e.target.value)}
                      className={inputClass("classId")}
                    >
                      <option value="">Belum menentukan — minta rekomendasi jadwal</option>
                      {classes.map(({ item, status }) => (
                        <option key={item.id} value={item.id}>
                          {item.name} · mulai {formatDateId(item.classStarts)} ({statusLabel[status]})
                        </option>
                      ))}
                    </select>
                    {selectedClass && selectedClass.status !== "open" && (
                      <p className="mt-1.5 text-[13px] text-warn">
                        {selectedClass.status === "upcoming"
                          ? "Pendaftaran kelas ini belum dibuka — kami akan mengabari Anda."
                          : selectedClass.status === "full"
                            ? "Kuota penuh — Anda akan masuk daftar tunggu."
                            : "Pendaftaran ditutup — kami akan info batch berikutnya."}
                      </p>
                    )}
                  </div>
                )}

                {program && program.pricing.length > 0 && (
                  <fieldset className="sm:col-span-2">
                    <legend className="text-sm font-semibold text-ink">Paket belajar</legend>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {program.pricing.map((p) => {
                        const checked = fields.planId === p.id;
                        return (
                          <label
                            key={p.id}
                            className={`relative flex cursor-pointer flex-col rounded-2xl border px-2.5 py-2.5 text-center transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand-yellow-dark ${
                              checked
                                ? "border-brand-teal bg-brand-teal-soft shadow-[0_0_0_3px_rgb(16_144_138/0.12)]"
                                : "border-line hover:border-brand-teal/40"
                            }`}
                          >
                            <input
                              type="radio"
                              name="plan"
                              value={p.id}
                              checked={checked}
                              onChange={() => set("planId", p.id)}
                              className="sr-only"
                            />
                            <span className="text-[11.5px] leading-tight font-semibold text-ink-soft">{p.label}</span>
                            <span className="mt-1 text-[15px] font-extrabold text-ink">{formatRupiah(p.price)}</span>
                            <span className="text-[10.5px] leading-tight text-ink-soft">{p.unit}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                <Field id="parentName" label="Nama orang tua / wali" error={errors.parentName}>
                  <input
                    id="reg-parentName"
                    autoComplete="name"
                    value={fields.parentName}
                    onChange={(e) => set("parentName", e.target.value)}
                    aria-invalid={Boolean(errors.parentName)}
                    aria-describedby={errors.parentName ? "reg-parentName-error" : undefined}
                    placeholder="Nama Anda"
                    className={inputClass("parentName")}
                  />
                </Field>

                <Field id="childName" label="Nama anak" error={errors.childName}>
                  <input
                    id="reg-childName"
                    value={fields.childName}
                    onChange={(e) => set("childName", e.target.value)}
                    aria-invalid={Boolean(errors.childName)}
                    aria-describedby={errors.childName ? "reg-childName-error" : undefined}
                    placeholder="Nama anak"
                    className={inputClass("childName")}
                  />
                </Field>

                <Field id="childAge" label="Usia anak" error={errors.childAge}>
                  <select
                    id="reg-childAge"
                    value={fields.childAge}
                    onChange={(e) => set("childAge", e.target.value)}
                    aria-invalid={Boolean(errors.childAge)}
                    aria-describedby={errors.childAge ? "reg-childAge-error" : undefined}
                    className={inputClass("childAge")}
                  >
                    <option value="">Pilih usia</option>
                    {AGES.map((age) => (
                      <option key={age} value={age}>
                        {age} tahun
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="city" label="Kota / domisili" error={errors.city}>
                  <input
                    id="reg-city"
                    autoComplete="address-level2"
                    value={fields.city}
                    onChange={(e) => set("city", e.target.value)}
                    aria-invalid={Boolean(errors.city)}
                    aria-describedby={errors.city ? "reg-city-error" : undefined}
                    placeholder="Mis. Jakarta Selatan"
                    className={inputClass("city")}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <label htmlFor="reg-source" className="text-sm font-semibold text-ink">
                    Tahu Partner Belajar dari mana? <span className="font-normal text-ink-soft">(opsional)</span>
                  </label>
                  <select
                    id="reg-source"
                    value={fields.source}
                    onChange={(e) => set("source", e.target.value)}
                    className={inputClass("source")}
                  >
                    <option value="">Pilih salah satu</option>
                    {SOURCES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="reg-notes" className="text-sm font-semibold text-ink">
                    Catatan <span className="font-normal text-ink-soft">(opsional)</span>
                  </label>
                  <textarea
                    id="reg-notes"
                    rows={2}
                    value={fields.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Mis. anak sudah bisa membaca iqra 3, ingin jadwal sore"
                    className={`${inputClass("notes")} resize-y`}
                  />
                </div>

                {/* Honeypot: disembunyikan dari manusia, sering diisi bot. */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Website
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={fields.website}
                      onChange={(e) => set("website", e.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="shrink-0 border-t border-line bg-surface px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1faf55] px-6 text-[15px] font-semibold text-white shadow-[0_12px_24px_-14px_rgb(31_175_85/0.95)] transition-all hover:-translate-y-0.5 hover:bg-[#1a9c4b]"
                >
                  <MessageCircle aria-hidden className="size-5" />
                  Lanjut ke WhatsApp
                </button>
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
                  <ShieldCheck aria-hidden className="size-3.5 text-brand-teal" />
                  Data hanya dipakai untuk memproses pendaftaran Anda.
                </p>
              </div>
            </form>
          )}
        </>
      )}
    </dialog>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`reg-${id}`} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`reg-${id}-error`} className="mt-1 text-[13px] text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
