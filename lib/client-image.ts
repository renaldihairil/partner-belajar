/** Batas ukuran foto yang dikirim ke server (sama dengan lib/storage.ts). */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/** Kecilkan foto di browser dulu (maks. 1600px, WebP) agar upload cepat & di bawah batas ukuran. Hanya di browser. */
export async function shrinkImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    // Format yang tidak bisa dibaca browser (mis. HEIC) dikirim apa adanya dan diproses di server.
    return file;
  }
}
