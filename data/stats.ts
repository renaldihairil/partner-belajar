import type { Stat } from "@/types";

/**
 * Angka statistik Partner Belajar (ditampilkan di section "Dalam Angka" Home).
 */
export const stats: Stat[] = [
  {
    id: "siswa",
    icon: "students",
    value: 150,
    suffix: "+",
    label: "Siswa terdaftar",
    caption: "dari berbagai kota di Indonesia",
  },
  {
    id: "pengajar",
    icon: "teachers",
    value: 25,
    suffix: "+",
    label: "Pengajar profesional",
    caption: "terseleksi & terlatih",
  },
  {
    id: "pertemuan",
    icon: "sessions",
    value: 35,
    suffix: "+",
    label: "Pertemuan terlaksana",
    caption: "online & tatap muka",
  },
  {
    id: "rating",
    icon: "rating",
    value: 4.8,
    decimals: 1,
    label: "Kepuasan orang tua",
    caption: "rata-rata ulasan keluarga",
  },
];
