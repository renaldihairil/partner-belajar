import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Penyimpanan foto yang diunggah admin.
 * - Vercel Blob terhubung → disimpan di Vercel Blob. Kredensial dibaca otomatis oleh @vercel/blob:
 *   BLOB_READ_WRITE_TOKEN (cara lama) atau BLOB_STORE_ID + token OIDC Vercel (cara baru).
 * - Development tanpa Blob → disimpan di public/uploads (tidak ikut git).
 * Untuk pindah penyedia (mis. Cloudflare R2), cukup ganti fungsi di file ini.
 */

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"];

export type StoredImage = { url: string; width: number; height: number };

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export function isStorageConfigured(): boolean {
  return blobConfigured() || process.env.NODE_ENV !== "production";
}

/**
 * Mengecilkan foto (maks. 1600px, WebP) dan menghapus metadata (termasuk lokasi GPS) —
 * penting karena foto bisa berisi anak-anak.
 */
export async function saveImage(file: File, folder: string): Promise<StoredImage> {
  if (!ACCEPTED.includes(file.type)) throw new Error("Format tidak didukung. Gunakan JPG, PNG, atau WebP.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Ukuran foto maksimal 4 MB.");

  // Dimuat saat dibutuhkan saja, agar halaman admin lain tetap ringan.
  const { default: sharp } = await import("sharp");
  const input = Buffer.from(await file.arrayBuffer());
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });

  const name = `${folder}/${Date.now().toString(36)}-${randomUUID().slice(0, 8)}.webp`;

  if (blobConfigured()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${name}`, data, { access: "public", contentType: "image/webp" });
    return { url: blob.url, width: info.width, height: info.height };
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("Penyimpanan foto belum terhubung. Hubungkan Vercel Blob di menu Storage lalu deploy ulang.");
  }
  const target = path.join(process.cwd(), "public", "uploads", name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, data);
  return { url: `/uploads/${name}`, width: info.width, height: info.height };
}

/**
 * Apakah URL ini foto hasil upload sistem kita di folder tertentu? Dipakai untuk menolak URL
 * sembarang dari formulir publik (mis. link ke situs lain atau gambar pelacak).
 */
export function isOwnUploadUrl(url: string, folder: string): boolean {
  if (url.startsWith(`/uploads/${folder}/`)) return !url.includes("..");
  const blobUrl = new RegExp(`^https://[a-z0-9-]+\.public\.blob\.vercel-storage\.com/uploads/${folder}/[A-Za-z0-9._-]+\.webp$`);
  return blobUrl.test(url);
}

/** Menghapus foto lama yang sudah tidak dipakai (hanya foto hasil upload; gambar bawaan dibiarkan). */
export async function deleteImage(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    if (url.includes(".blob.vercel-storage.com/") && blobConfigured()) {
      const { del } = await import("@vercel/blob");
      await del(url);
    } else if (url.startsWith("/uploads/") && process.env.NODE_ENV !== "production") {
      await unlink(path.join(process.cwd(), "public", url));
    }
  } catch (error) {
    console.error("[storage] Gagal menghapus foto lama:", error);
  }
}
