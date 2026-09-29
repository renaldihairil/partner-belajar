import { z } from "zod";

/** Hasil server action admin untuk useActionState. */
export type ActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export const initialActionState: ActionState = {};

/** "Diniyyah Partner!" → "diniyyah-partner" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Mengambil nilai FormData sebagai objek biasa; field *_json di-parse sebagai JSON. */
export function formToObject(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$ACTION")) continue;
    if (typeof value !== "string") continue;
    if (key.endsWith("_json")) {
      try {
        out[key.slice(0, -5)] = JSON.parse(value);
      } catch {
        out[key.slice(0, -5)] = undefined;
      }
    } else if (key.endsWith("[]")) {
      const name = key.slice(0, -2);
      out[name] = [...((out[name] as string[]) ?? []), value];
    } else {
      out[key] = value;
    }
  }
  return out;
}

/** Ubah error Zod menjadi { field: pesan } (pesan pertama per field). */
export function zodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    errors[key] ??= issue.message;
  }
  return errors;
}

// ---- Skema field umum ----
export const requiredText = (label: string, max = 500) =>
  z.string({ error: `${label} wajib diisi.` }).trim().min(1, `${label} wajib diisi.`).max(max, `${label} terlalu panjang (maks. ${max} karakter).`);

export const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max, `Terlalu panjang (maks. ${max} karakter).`)
    .optional()
    .transform((v) => (v ? v : null));

export const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal("1"), z.literal("")])
  .optional()
  .transform((v) => v === "on" || v === "true" || v === "1");

export const isoDate = (label: string) =>
  z.string({ error: `${label} wajib diisi.` }).regex(/^\d{4}-\d{2}-\d{2}$/, `${label} wajib diisi (format tanggal).`);

export const intField = (label: string, min = 0, max = 100000) =>
  z.coerce
    .number({ error: `${label} harus berupa angka.` })
    .int(`${label} harus bilangan bulat.`)
    .min(min, `${label} minimal ${min}.`)
    .max(max, `${label} maksimal ${max}.`);
