import { NextResponse, type NextRequest } from "next/server";

/**
 * Menerima data pendaftaran dari formulir (sebelum pengunjung diarahkan ke WhatsApp).
 *
 * - Selalu dicatat ke log server (terlihat di Vercel → Logs).
 * - Jika `LEADS_WEBHOOK_URL` diisi (mis. Google Apps Script → Google Sheets), data diteruskan ke sana
 *   sehingga admin bisa melihat semua pendaftaran dalam satu spreadsheet. Lihat docs/tracking-pendaftaran.md.
 */

const MAX = 300;
const FIELDS = [
  "ref",
  "intent",
  "programTitle",
  "className",
  "planLabel",
  "parentName",
  "childName",
  "childAge",
  "city",
  "whatsapp",
  "source",
  "notes",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "referrer",
  "landingPage",
  "pagePath",
  "device",
] as const;

type CleanLead = Partial<Record<(typeof FIELDS)[number], string>>;

function clean(input: Record<string, unknown>): CleanLead {
  const out: CleanLead = {};
  for (const key of FIELDS) {
    const value = input[key];
    if (typeof value === "string" && value.trim()) out[key] = value.trim().slice(0, key === "notes" ? 1000 : MAX);
  }
  return out;
}

function decode(value: string | null) {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot anti-bot: field tersembunyi yang harus kosong.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const lead = clean(body);
  if (!lead.ref || !/^PB-[A-Z]{2}-[A-Z0-9]{4}$/.test(lead.ref) || !lead.parentName) {
    return NextResponse.json({ ok: false, error: "invalid_lead" }, { status: 422 });
  }

  const record = {
    receivedAt: new Date().toISOString(),
    ...lead,
    // Perkiraan lokasi dari IP (tersedia otomatis saat di-deploy di Vercel).
    ipCity: decode(request.headers.get("x-vercel-ip-city")),
    ipRegion: request.headers.get("x-vercel-ip-country-region") ?? undefined,
    ipCountry: request.headers.get("x-vercel-ip-country") ?? undefined,
    userAgent: request.headers.get("user-agent")?.slice(0, MAX) ?? undefined,
  };

  console.info("[lead]", JSON.stringify(record));

  const webhook = process.env.LEADS_WEBHOOK_URL;
  let forwarded = false;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...record, secret: process.env.LEADS_WEBHOOK_SECRET ?? "" }),
        signal: AbortSignal.timeout(8000),
      });
      forwarded = res.ok;
      if (!res.ok) console.error("[lead] webhook status", res.status);
    } catch (error) {
      console.error("[lead] webhook gagal", error);
    }
  }

  return NextResponse.json({ ok: true, forwarded });
}
