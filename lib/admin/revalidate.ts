import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Memperbarui semua halaman publik setelah data diubah di admin.
 * Data dipakai di banyak tempat (layout, Home, Program, Contact, sitemap), jadi
 * seluruh situs diperbarui sekaligus — situsnya kecil, ini tetap ringan.
 */
export function revalidateSite() {
  revalidatePath("/", "layout");
}
