"use client";

import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  // Matikan transisi sesaat agar pergantian tema terasa instan & rapi.
  root.classList.add("theme-switching");
  root.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Penyimpanan diblokir — tema tetap berganti untuk sesi ini.
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0c1d1c" : "#10908a");
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => root.classList.remove("theme-switching")));
}

/** Ikon mengikuti atribut data-theme lewat CSS, jadi aman dari hydration mismatch. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark")}
      aria-label="Ganti mode terang / gelap"
      title="Ganti mode terang / gelap"
      className={`theme-toggle relative grid size-11 place-items-center overflow-hidden rounded-full bg-background text-ink ring-1 ring-line transition-colors hover:text-brand-teal ${className}`}
    >
      <Sun aria-hidden className="theme-icon theme-icon--sun size-5" />
      <Moon aria-hidden className="theme-icon theme-icon--moon size-5" />
    </button>
  );
}
