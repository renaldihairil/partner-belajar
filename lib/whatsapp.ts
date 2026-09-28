import { siteConfig } from "@/lib/site-config";
import type { Lead, LeadIntent } from "@/types";

export function whatsappUrl(text?: string, phone: string = siteConfig.contact.whatsapp) {
  return `https://wa.me/${phone}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function formatRupiah(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

const heading: Record<LeadIntent, string> = {
  daftar: "Saya ingin *mendaftar* kelas berikut:",
  ingatkan: "Mohon *kabari saya* saat pendaftaran kelas ini dibuka:",
  tunggu: "Saya ingin masuk *daftar tunggu* kelas berikut:",
  info: "Saya ingin menanyakan *jadwal batch berikutnya*:",
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
