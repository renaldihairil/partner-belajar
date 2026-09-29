"use server";

import { PERMISSION_KEYS, hasPermission } from "@/lib/auth/permissions";
import { requireAdmin } from "@/lib/auth/session";
import { saveImage } from "@/lib/storage";

export type UploadResult = { url: string; width: number; height: number } | { error: string };

const FOLDERS = ["program", "pengajar", "testimoni", "artikel", "umum"];

export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  const admin = await requireAdmin();
  if (!PERMISSION_KEYS.some((key) => hasPermission(admin, key))) return { error: "Anda tidak punya akses untuk mengunggah foto." };
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "umum");
  if (!(file instanceof File) || file.size === 0) return { error: "Pilih foto terlebih dahulu." };
  try {
    return await saveImage(file, FOLDERS.includes(folder) ? folder : "umum");
  } catch (error) {
    console.error("[upload]", error);
    return { error: error instanceof Error ? error.message : "Gagal mengunggah foto." };
  }
}
