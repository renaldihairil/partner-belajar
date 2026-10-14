import { siteConfig } from "@/lib/site-config";
import type { Lead, LeadIntent } from "@/types";

/** `phone` kosong/undefined → nomor utama situs. Nomor khusus program diberikan lewat `program.whatsapp`. */
export function whatsappUrl(text?: string, phone?: string | null) {
  const target = phone || siteConfig.contact.whatsapp;
  return `https://wa.me/${target}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/**
 * Merapikan nomor WhatsApp ke format internasional tanpa "+" / spasi / tanda hubung.
 * "0812-3456-7890" → "6281234567890", "+62 812 3456 7890" → "6281234567890", "812..." → "62812...".
 * Mengembalikan null bila bukan nomor yang masuk akal (9–15 digit).
 */
export function normalizeWhatsapp(input: string): string | null {
  let digits = input.replace(/[^\d]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  return digits.length >= 9 && digits.length <= 15 ? digits : null;
}

export function formatRupiah(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

const heading: Record<LeadIntent, string> = {
  daftar: "Saya ingin *mendaftar* kelas berikut:",
  ingatkan: "Mohon *kabari saya* saat pendaftaran kelas ini dibuka:",
  tunggu: "Saya ingin masuk *daftar tunggu* kelas berikut:",
  info: "Saya ingin menanyakan *jadwal kelas yang tersedia*:",
  tanya: "Saya ingin *bertanya*:",
};

/** Menyusun pesan WhatsApp yang rapi & mudah dibaca admin. Kode ref dipakai untuk mencocokkan dengan data tracking. */
export function buildWhatsappMessage(lead: Lead) {
  const hasProgramInfo = Boolean(lead.programTitle || lead.className || lead.planLabel);
  const lines: (string | null)[] = [
    "Assalamu'alaikum Admin Partner Belajar 👋",
    heading[lead.intent],
    "",
    lead.programTitle ? `📚 Program: ${lead.programTitle}` : null,
    lead.className ? `🗓️ Kelas: ${lead.className}` : null,
    lead.planLabel ? `💳 Paket: ${lead.planLabel}` : null,
    hasProgramInfo ? "" : null,
    `👤 Nama${lead.childName ? " orang tua" : ""}: ${lead.parentName}`,
    lead.childName ? `🧒 Nama anak: ${lead.childName}${lead.childAge ? ` (${lead.childAge} tahun)` : ""}` : null,
    lead.city ? `📍 Domisili: ${lead.city}` : null,
    lead.whatsapp ? `📱 No. WhatsApp: ${lead.whatsapp}` : null,
    lead.source ? `📣 Tahu dari: ${lead.source}` : null,
    lead.notes ? "" : null,
    lead.notes ? `📝 ${lead.notes}` : null,
    "",
    `Kode: ${lead.ref}`,
  ];
  return lines.filter((line) => line !== null).join("\n");
}
