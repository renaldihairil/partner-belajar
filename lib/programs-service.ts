import { programClasses } from "@/data/program-classes";
import { programs } from "@/data/programs";
import type { ProgramWithClasses } from "@/types";

/**
 * Satu pintu untuk mengambil program + jadwal kelas.
 *
 * - Sekarang (Phase 1): memakai mock data lokal.
 * - Nanti: isi env `PROGRAMS_API_URL` (server-only) dengan endpoint yang mengembalikan
 *   `ProgramWithClasses[]` (lihat types/index.ts). Komponen tidak perlu diubah.
 *   Jika API gagal, halaman otomatis kembali ke mock data agar situs tidak rusak.
 */
export async function getProgramsWithClasses(): Promise<ProgramWithClasses[]> {
  const apiUrl = process.env.PROGRAMS_API_URL;
  if (apiUrl) {
    try {
      const res = await fetch(apiUrl, { next: { revalidate: 300 } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: unknown = await res.json();
      if (Array.isArray(data)) return data as ProgramWithClasses[];
      throw new Error("Format respons tidak valid (harus array)");
    } catch (error) {
      console.error("[programs-service] Gagal memuat dari API, memakai mock data:", error);
    }
  }
  return getMockProgramsWithClasses();
}

export function getMockProgramsWithClasses(): ProgramWithClasses[] {
  return programs.map((program) => ({
    ...program,
    classes: programClasses.filter((item) => item.programId === program.id),
  }));
}
