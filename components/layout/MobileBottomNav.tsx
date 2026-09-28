"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutGrid, X } from "lucide-react";
import { NavItem } from "@/components/navigation/NavItem";
import { isActivePath, moreMobileNav, primaryMobileNav } from "@/components/navigation/navigation-config";

const tones = [
  "bg-brand-teal-soft text-brand-teal-dark",
  "bg-brand-yellow-soft text-warn",
  "bg-soft-purple text-accent-purple-ink",
  "bg-soft-blue text-brand-teal-dark",
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const moreActive = moreMobileNav.some((item) => isActivePath(pathname, item.href));

  // Tutup panel saat pindah halaman.
  useEffect(() => setOpen(false), [pathname]);

  // Esc menutup panel & fokus kembali ke tombol "Lainnya"; fokus pindah ke item pertama saat dibuka.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Latar gelap: klik di luar panel untuk menutup */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-[rgb(8_40_38/0.35)] backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        id="more-menu"
        aria-label="Menu lainnya"
        role="region"
        hidden={!open}
        className="more-sheet fixed inset-x-3 bottom-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom)+10px)] z-40 rounded-[26px] border border-line bg-surface p-3 shadow-lift md:hidden"
      >
        <p className="px-2 pt-1 pb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">Menu lainnya</p>
        <ul className="grid grid-cols-2 gap-2">
          {moreMobileNav.map((item, index) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href} className="more-item" style={{ animationDelay: `${index * 45}ms` }}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[88px] flex-col justify-between rounded-2xl p-3 ring-1 transition-colors ${
                    active ? "bg-brand-teal-soft ring-brand-teal/40" : "bg-background ring-transparent hover:ring-line"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className={`grid size-10 place-items-center rounded-xl ${tones[index % tones.length]}`}>
                      <Icon aria-hidden className="size-5" strokeWidth={2} />
                    </span>
                    <ChevronRight aria-hidden className="size-4 text-ink-soft" />
                  </span>
                  <span className="mt-2">
                    <span className="block text-sm font-bold text-ink">{item.label}</span>
                    {item.description && <span className="block text-[11.5px] leading-tight text-ink-soft">{item.description}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <nav
        aria-label="Navigasi utama"
        className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 shadow-[0_-8px_24px_-16px_rgb(21_95_91/0.35)] backdrop-blur md:hidden"
      >
        <ul className="mx-auto flex h-[var(--bottom-nav-height)] max-w-md items-stretch px-2 py-1.5">
          {primaryMobileNav.map((item) => (
            <li key={item.href} className="flex flex-1">
              <NavItem {...item} variant="bottom" active={!open && isActivePath(pathname, item.href)} />
            </li>
          ))}
          <li className="flex flex-1">
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="more-menu"
              className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] transition-colors ${
                open || moreActive ? "font-bold text-brand-teal-dark" : "font-medium text-ink-soft hover:text-ink"
              }`}
            >
              <span className="relative grid size-6 place-items-center">
                <LayoutGrid
                  aria-hidden
                  className={`absolute size-6 transition-all duration-300 ${open ? "scale-50 rotate-90 opacity-0" : ""} ${
                    moreActive ? "text-brand-teal" : "text-muted"
                  }`}
                  strokeWidth={moreActive ? 2.4 : 1.8}
                  fill={moreActive ? "currentColor" : "none"}
                  fillOpacity={0.18}
                />
                <X
                  aria-hidden
                  className={`absolute size-6 text-brand-teal transition-all duration-300 ${open ? "" : "scale-50 -rotate-90 opacity-0"}`}
                  strokeWidth={2.4}
                />
              </span>
              Lainnya
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
