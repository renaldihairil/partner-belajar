"use client";

import type { Lead } from "@/types";

/**
 * Tracking ringan tanpa library: menyimpan sumber kunjungan pertama (UTM / referrer)
 * dan mengirim data pendaftaran ke /api/leads sebelum membuka WhatsApp.
 */

const STORAGE_KEY = "pb_attribution";

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  landingPage?: string;
};

function safeStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Dipanggil sekali per kunjungan. UTM baru menimpa yang lama; tanpa UTM, sumber pertama dipertahankan. */
export function captureAttribution() {
  const storage = safeStorage();
  const params = new URLSearchParams(window.location.search);
  const utm = {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  };
  const hasUtm = Boolean(utm.utmSource || utm.utmMedium || utm.utmCampaign);
  try {
    if (storage?.getItem(STORAGE_KEY) && !hasUtm) return;
    const externalReferrer =
      document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : undefined;
    const value: Attribution = {
      ...utm,
      referrer: externalReferrer,
      landingPage: window.location.pathname + window.location.search,
    };
    storage?.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Penyimpanan diblokir (mode privat) — tracking tetap jalan tanpa atribusi.
  }
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(safeStorage()?.getItem(STORAGE_KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}

/** Tebakan sumber yang mudah dibaca, untuk mengisi otomatis pilihan "Tahu dari mana". */
export function guessSource(attribution: Attribution): string | undefined {
  const raw = `${attribution.utmSource ?? ""} ${attribution.referrer ?? ""}`.toLowerCase();
  if (raw.includes("instagram")) return "Instagram";
  if (raw.includes("tiktok")) return "TikTok";
  if (raw.includes("facebook") || raw.includes("fb.")) return "Facebook";
  if (raw.includes("youtube")) return "YouTube";
  if (raw.includes("google")) return "Google";
  if (raw.includes("whatsapp") || raw.includes("wa.me")) return "WhatsApp";
  return undefined;
}

/** Kode pendaftaran pendek & mudah dibaca, mis. PB-EN-7K3F (tanpa karakter yang mirip seperti O/0, I/1). */
export function createRef(code: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `PB-${code}-${suffix}`;
}

export function deviceType(): "mobile" | "desktop" {
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

/** Kirim lead tanpa menunggu (tetap terkirim walau halaman berpindah ke WhatsApp). */
export function sendLead(lead: Lead & { website?: string }) {
  const body = JSON.stringify(lead);
  let queued = false;
  try {
    queued = navigator.sendBeacon?.("/api/leads", new Blob([body], { type: "application/json" })) ?? false;
  } catch {
    queued = false;
  }
  if (!queued) {
    fetch("/api/leads", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(
      () => undefined,
    );
  }

  // Hook opsional untuk Google Tag Manager / GA4 bila dipasang nanti.
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer?.push({
    event: "generate_lead",
    lead_ref: lead.ref,
    lead_intent: lead.intent,
    program: lead.programTitle,
    plan: lead.planLabel,
  });
}
