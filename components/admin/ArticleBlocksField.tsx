"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ArticleBlock } from "@/types";
import { inputClass } from "./fields";

const TYPE_OPTIONS: { value: ArticleBlock["type"]; label: string }[] = [
  { value: "p", label: "Paragraf" },
  { value: "h2", label: "Subjudul" },
  { value: "list", label: "Daftar poin" },
  { value: "tip", label: "Kotak tips" },
];

/** Bentuk kerja di editor: teks tunggal (semua tipe) + apakah daftar bernomor. */
type Draft = { type: ArticleBlock["type"]; text: string; ordered: boolean };

function toDraft(block: ArticleBlock): Draft {
  return block.type === "list"
    ? { type: "list", text: block.items.join("\n"), ordered: Boolean(block.ordered) }
    : { type: block.type, text: block.text, ordered: false };
}

function toBlock(draft: Draft): ArticleBlock | null {
  const text = draft.text.trim();
  if (!text) return null;
  if (draft.type === "list") {
    const items = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return items.length ? { type: "list", items, ...(draft.ordered ? { ordered: true } : {}) } : null;
  }
  return { type: draft.type, text };
}

const btn = "grid size-7 place-items-center rounded-md text-ink-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink disabled:opacity-30";

type Props = { name: string; label: string; hint?: string; error?: string; defaultValue?: ArticleBlock[] };

/** Editor isi artikel berbasis blok (paragraf, subjudul, daftar, tips). Terkirim sebagai `${name}_json`. */
export function ArticleBlocksField({ name, label, hint, error, defaultValue = [] }: Props) {
  const [drafts, setDrafts] = useState<Draft[]>(() => (defaultValue.length ? defaultValue.map(toDraft) : [{ type: "p", text: "", ordered: false }]));
  const patch = (index: number, change: Partial<Draft>) => setDrafts((prev) => prev.map((d, i) => (i === index ? { ...d, ...change } : d)));
  const move = (from: number, to: number) =>
    setDrafts((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });

  const serialized = drafts.map(toBlock).filter((b): b is ArticleBlock => b !== null);

  return (
    <fieldset>
      <legend className="mb-1.5 text-[13px] font-medium text-ink">{label}</legend>
      {hint && <p className="-mt-1 mb-2 text-xs text-ink-soft">{hint}</p>}
      <input type="hidden" name={`${name}_json`} value={JSON.stringify(serialized)} />
      <div className="flex flex-col gap-3">
        {drafts.map((draft, index) => {
          const id = `${name}-${index}`;
          return (
            <div key={index} className="rounded-lg border border-line bg-[var(--adm-hover)]/40 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-grid size-5 place-items-center rounded-md bg-surface text-[11px] font-semibold text-ink-soft ring-1 ring-line">{index + 1}</span>
                  <select
                    aria-label={`Jenis blok ${index + 1}`}
                    value={draft.type}
                    onChange={(e) => patch(index, { type: e.target.value as Draft["type"] })}
                    className={`${inputClass} !h-8 !w-auto !py-0 text-[13px]`}
                  >
                    {TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {draft.type === "list" && (
                    <label className="flex items-center gap-1.5 text-[13px] text-ink-soft">
                      <input type="checkbox" checked={draft.ordered} onChange={(e) => patch(index, { ordered: e.target.checked })} className="size-4 accent-[var(--brand-teal)]" />
                      Bernomor
                    </label>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button type="button" className={btn} disabled={index === 0} onClick={() => move(index, index - 1)} aria-label={`Naikkan blok ${index + 1}`}>
                    <ArrowUp aria-hidden className="size-4" />
                  </button>
                  <button type="button" className={btn} disabled={index === drafts.length - 1} onClick={() => move(index, index + 1)} aria-label={`Turunkan blok ${index + 1}`}>
                    <ArrowDown aria-hidden className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={`${btn} hover:!bg-red-50 hover:!text-red-600`}
                    onClick={() => setDrafts((prev) => prev.filter((_, i) => i !== index))}
                    aria-label={`Hapus blok ${index + 1}`}
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
              </div>
              {draft.type === "h2" ? (
                <input id={id} value={draft.text} onChange={(e) => patch(index, { text: e.target.value })} placeholder="Judul bagian" className={inputClass} />
              ) : (
                <textarea
                  id={id}
                  rows={draft.type === "p" ? 4 : 3}
                  value={draft.text}
                  onChange={(e) => patch(index, { text: e.target.value })}
                  placeholder={draft.type === "list" ? "Satu poin per baris" : draft.type === "tip" ? "Isi tips singkat" : "Tulis paragraf di sini"}
                  className={`${inputClass} resize-y`}
                />
              )}
            </div>
          );
        })}
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setDrafts((prev) => [...prev, { type: o.value, text: "", ordered: false }])}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-line px-3 text-sm font-medium text-ink-soft transition-colors hover:border-brand-teal/50 hover:bg-brand-teal-soft/50 hover:text-brand-teal-dark"
            >
              <Plus aria-hidden className="size-4" />
              {o.label}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </fieldset>
  );
}
