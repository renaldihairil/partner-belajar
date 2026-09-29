"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { slugify } from "@/lib/admin/form";

const TITLE_MAX = 65;
const DESC_MIN = 70;
const DESC_MAX = 160;

/** Pratinjau tampilan di hasil Google + tips panjang judul/ringkasan. Membaca isian formulir langsung. */
export function SeoPreview({ siteUrl, siteName }: { siteUrl: string; siteName: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState({ title: "", slug: "", excerpt: "" });

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const read = () => {
      const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
      setValues({ title: get("title"), slug: get("slug"), excerpt: get("excerpt") });
    };
    read();
    form.addEventListener("input", read);
    return () => form.removeEventListener("input", read);
  }, []);

  const title = values.title.trim() || "Judul artikel";
  const slug = slugify(values.slug || values.title) || "judul-artikel";
  const excerpt = values.excerpt.trim() || "Ringkasan artikel akan tampil di sini.";
  const host = siteUrl.replace(/^https?:\/\//, "");
  const shownTitle = `${title} — ${siteName}`;

  const tips: { ok: boolean; text: string }[] = [
    { ok: shownTitle.length <= TITLE_MAX, text: `Judul di Google ±${shownTitle.length} karakter (ideal ≤ ${TITLE_MAX}); yang terlalu panjang akan terpotong.` },
    {
      ok: excerpt.length >= DESC_MIN && excerpt.length <= DESC_MAX,
      text: `Ringkasan ${values.excerpt.trim().length} karakter (ideal ${DESC_MIN}–${DESC_MAX}); ringkasan ini dipakai Google sebagai deskripsi.`,
    },
  ];

  return (
    <div ref={ref} className="grid gap-3">
      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="truncate text-xs text-ink-soft">
          {host} › artikel › {slug}
        </p>
        <p className="mt-1 line-clamp-2 text-[18px] leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">{shownTitle}</p>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">{excerpt}</p>
      </div>
      <ul className="grid gap-1.5">
        {tips.map((tip) => (
          <li key={tip.text} className={`flex items-start gap-2 text-xs ${tip.ok ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>
            {tip.ok ? <CheckCircle2 aria-hidden className="mt-0.5 size-3.5 shrink-0" /> : <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />}
            {tip.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
