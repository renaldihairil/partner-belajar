import { BookOpen, GraduationCap, LayoutDashboard, MessageSquareQuote, UserCog, type LucideIcon } from "lucide-react";

export type AdminNavItem = { href: string; label: string; icon: LucideIcon };

/** Menu admin, dikelompokkan. Fase berikutnya cukup menambah item di sini. */
export const adminNavGroups: { label: string; items: AdminNavItem[] }[] = [
  { label: "Ringkasan", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Konten",
    items: [
      { href: "/admin/program", label: "Program & Jadwal", icon: BookOpen },
      { href: "/admin/pengajar", label: "Pengajar", icon: GraduationCap },
      { href: "/admin/testimoni", label: "Testimoni", icon: MessageSquareQuote },
    ],
  },
  { label: "Pengaturan", items: [{ href: "/admin/akun", label: "Akun Admin", icon: UserCog }] },
];

export function isAdminNavActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

const segmentLabels: Record<string, string> = {
  admin: "Dashboard",
  program: "Program & Jadwal",
  pengajar: "Pengajar",
  testimoni: "Testimoni",
  akun: "Akun Admin",
  kelas: "Jadwal kelas",
  baru: "Tambah baru",
};

/** "/admin/program/english/kelas" → [Admin, Program & Jadwal, Detail, Jadwal kelas] */
export function breadcrumbsFor(pathname: string): { href: string; label: string }[] {
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((part, index) => ({
    href: `/${parts.slice(0, index + 1).join("/")}`,
    label: segmentLabels[part] ?? "Detail",
  }));
}
