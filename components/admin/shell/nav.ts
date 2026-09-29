import { BookOpen, Newspaper, GraduationCap, LayoutDashboard, MessageSquareQuote, UserCog, Users, type LucideIcon } from "lucide-react";

import type { PermissionKey } from "@/lib/auth/permissions";

export type AdminNavItem = { href: string; label: string; icon: LucideIcon; permission?: PermissionKey; ownerOnly?: boolean };

/** Menu admin, dikelompokkan. Fase berikutnya cukup menambah item di sini. */
export const adminNavGroups: { label: string; items: AdminNavItem[] }[] = [
  { label: "Ringkasan", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Konten",
    items: [
      { href: "/admin/program", label: "Program & Jadwal", icon: BookOpen, permission: "program" },
      { href: "/admin/pengajar", label: "Pengajar", icon: GraduationCap, permission: "pengajar" },
      { href: "/admin/testimoni", label: "Testimoni", icon: MessageSquareQuote, permission: "testimoni" },
      { href: "/admin/artikel", label: "Artikel", icon: Newspaper, permission: "artikel" },
    ],
  },
  {
    label: "Pengaturan",
    items: [
      { href: "/admin/akun", label: "Akun Saya", icon: UserCog },
      { href: "/admin/pengguna", label: "Kelola Admin", icon: Users, ownerOnly: true },
    ],
  },
];

/** Menu yang boleh dilihat pengguna ini (menu tanpa "permission" terbuka untuk semua admin). */
export function visibleNavGroups(access: { role: string; permissions: string[] }) {
  return adminNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          (!item.ownerOnly || access.role === "owner") &&
          (!item.permission || access.role === "owner" || access.permissions.includes(item.permission)),
      ),
    }))
    .filter((group) => group.items.length > 0);
}

export function isAdminNavActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

const segmentLabels: Record<string, string> = {
  admin: "Dashboard",
  program: "Program & Jadwal",
  pengajar: "Pengajar",
  testimoni: "Testimoni",
  artikel: "Artikel",
  akun: "Akun Saya",
  pengguna: "Kelola Admin",
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
