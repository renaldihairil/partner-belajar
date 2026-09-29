"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { inputClass } from "./fields";

function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

type RowToolsProps = { index: number; total: number; onMove: (to: number) => void; onRemove: () => void; label: string };

function RowTools({ index, total, onMove, onRemove, label }: RowToolsProps) {
  const btn = "grid size-7 place-items-center rounded-md text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink disabled:opacity-30";
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button type="button" className={btn} disabled={index === 0} onClick={() => onMove(index - 1)} aria-label={`Naikkan ${label}`}>
        <ArrowUp aria-hidden className="size-4" />
      </button>
      <button type="button" className={btn} disabled={index === total - 1} onClick={() => onMove(index + 1)} aria-label={`Turunkan ${label}`}>
        <ArrowDown aria-hidden className="size-4" />
      </button>
      <button type="button" className={`${btn} hover:bg-red-50 hover:text-red-600`} onClick={onRemove} aria-label={`Hapus ${label}`}>
        <Trash2 aria-hidden className="size-4" />
      </button>
    </div>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 self-start rounded-lg border border-dashed border-line px-3 text-sm font-medium text-ink-soft transition-colors hover:border-brand-teal/50 hover:bg-brand-teal-soft/50 hover:text-brand-teal-dark"
    >
      <Plus aria-hidden className="size-4" />
      {children}
    </button>
  );
}

type StringListFieldProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  defaultValue?: string[];
  placeholder?: string;
  addLabel?: string;
};

/** Daftar teks sederhana (mis. keunggulan, hasil belajar). Terkirim sebagai `${name}_json`. */
export function StringListField({ name, label, hint, error, defaultValue = [], placeholder, addLabel = "Tambah" }: StringListFieldProps) {
  const [items, setItems] = useState<string[]>(defaultValue);
  return (
    <fieldset>
      <legend className="mb-1.5 text-[13px] font-medium text-ink">{label}</legend>
      {hint && <p className="-mt-1 mb-2 text-xs text-ink-soft">{hint}</p>}
      <input type="hidden" name={`${name}_json`} value={JSON.stringify(items.map((s) => s.trim()).filter(Boolean))} />
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(e) => setItems((prev) => prev.map((v, i) => (i === index ? e.target.value : v)))}
              placeholder={placeholder}
              aria-label={`${label} ${index + 1}`}
              className={inputClass}
            />
            <RowTools
              index={index}
              total={items.length}
              label={`${label} ${index + 1}`}
              onMove={(to) => setItems((prev) => move(prev, index, to))}
              onRemove={() => setItems((prev) => prev.filter((_, i) => i !== index))}
            />
          </div>
        ))}
        <AddButton onClick={() => setItems((prev) => [...prev, ""])}>{addLabel}</AddButton>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </fieldset>
  );
}

export type RepeaterFieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "lines" | "checkbox" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  /** Setengah lebar di layar besar. */
  half?: boolean;
  hint?: string;
};

type Item = Record<string, unknown>;

type RepeaterFieldProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  fields: RepeaterFieldDef[];
  defaultValue?: Item[];
  newItem: () => Item;
  itemLabel: (item: Item, index: number) => string;
  addLabel?: string;
};

/**
 * Daftar objek yang bisa ditambah, diurutkan, dan dihapus (kurikulum, paket harga, dll.).
 * Field bertipe "lines" diedit sebagai teks satu-baris-per-item dan disimpan sebagai array.
 */
export function RepeaterField({ name, label, hint, error, fields, defaultValue = [], newItem, itemLabel, addLabel = "Tambah" }: RepeaterFieldProps) {
  const [items, setItems] = useState<Item[]>(defaultValue);
  const update = (index: number, key: string, value: unknown) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

  const serialized = items.map((item) => {
    const out: Item = { ...item };
    for (const f of fields) {
      if (f.type === "lines") out[f.key] = ((item[f.key] as string[]) ?? []).map((s) => s.trim()).filter(Boolean);
    }
    return out;
  });

  return (
    <fieldset>
      <legend className="mb-1.5 text-[13px] font-medium text-ink">{label}</legend>
      {hint && <p className="-mt-1 mb-2 text-xs text-ink-soft">{hint}</p>}
      <input type="hidden" name={`${name}_json`} value={JSON.stringify(serialized)} />
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-line bg-[var(--adm-hover)]/40 p-3.5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-sm font-medium text-ink">
                <span className="mr-2 inline-grid size-5 place-items-center rounded-md bg-surface text-[11px] font-semibold text-ink-soft ring-1 ring-line">
                  {index + 1}
                </span>
                {itemLabel(item, index)}
              </p>
              <RowTools
                index={index}
                total={items.length}
                label={itemLabel(item, index)}
                onMove={(to) => setItems((prev) => move(prev, index, to))}
                onRemove={() => setItems((prev) => prev.filter((_, i) => i !== index))}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((f) => (
                <RepeaterInput key={f.key} def={f} id={`${name}-${index}-${f.key}`} value={item[f.key]} onChange={(v) => update(index, f.key, v)} />
              ))}
            </div>
          </div>
        ))}
        <AddButton onClick={() => setItems((prev) => [...prev, newItem()])}>{addLabel}</AddButton>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </fieldset>
  );
}

type RepeaterInputProps = { def: RepeaterFieldDef; id: string; value: unknown; onChange: (value: unknown) => void };

function RepeaterInput({ def: f, id, value, onChange }: RepeaterInputProps) {
  const span = f.half ? "" : "md:col-span-2";
  if (f.type === "checkbox") {
    return (
      <label className={`flex items-center gap-2 text-sm font-medium text-ink ${span}`}>
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[var(--brand-teal)]" />
        {f.label}
      </label>
    );
  }
  const cls = `${inputClass} text-sm`;
  let control;
  if (f.type === "lines") {
    control = (
      <textarea
        id={id}
        rows={4}
        value={((value as string[]) ?? []).join(NEWLINE)}
        onChange={(e) => onChange(e.target.value.split(NEWLINE))}
        placeholder={f.placeholder}
        className={`${cls} resize-y`}
      />
    );
  } else if (f.type === "textarea") {
    control = <textarea id={id} rows={2} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} className={`${cls} resize-y`} />;
  } else if (f.type === "select") {
    control = (
      <select id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={cls}>
        {f.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else {
    const isNumber = f.type === "number";
    control = (
      <input
        id={id}
        type={isNumber ? "number" : "text"}
        inputMode={isNumber ? "numeric" : undefined}
        value={String(value ?? "")}
        onChange={(e) => onChange(isNumber && e.target.value !== "" ? Number(e.target.value) : e.target.value)}
        placeholder={f.placeholder}
        className={cls}
      />
    );
  }
  return (
    <div className={span}>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-ink-soft">
        {f.label}
      </label>
      {control}
      {f.hint && <p className="mt-1 text-[11.5px] text-ink-soft">{f.hint}</p>}
    </div>
  );
}

const NEWLINE = String.fromCharCode(10);
