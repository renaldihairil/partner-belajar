"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string };

/** Daftar isi dengan penanda subjudul yang sedang dibaca. */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0 || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <ol className="relative flex flex-col gap-0.5 border-l-2 border-line">
      {items.map((item) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current ? "location" : undefined}
              className={`-ml-0.5 block border-l-2 py-1.5 pl-3 text-[13.5px] leading-snug transition-colors ${
                current
                  ? "border-brand-teal font-semibold text-brand-teal-dark"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
