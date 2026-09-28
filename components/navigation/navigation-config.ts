import {
  BookOpen,
  Camera,
  FileText,
  GraduationCap,
  Home,
  Mail,
  MessageSquareQuote,
  type LucideIcon,
} from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** "primary" tampil langsung di bottom nav mobile; "more" masuk ke panel "Lainnya". */
  mobile: "primary" | "more";
  /** Deskripsi singkat untuk panel "Lainnya" di mobile. */
  description?: string;
};

/** Satu sumber rute untuk sidebar desktop, bottom nav mobile, panel "Lainnya", dan sitemap. */
export const navigation: NavLink[] = [
  { href: "/", label: "Home", icon: Home, mobile: "primary" },
  { href: "/program", label: "Program", icon: BookOpen, mobile: "primary" },
  { href: "/artikel", label: "Artikel", icon: FileText, mobile: "primary" },
  {
    href: "/pengajar",
    label: "Pengajar",
    icon: GraduationCap,
    mobile: "more",
    description: "Kenali tim pengajar",
  },
  {
    href: "/dokumentasi",
    label: "Dokumentasi",
    icon: Camera,
    mobile: "more",
    description: "Galeri kegiatan belajar",
  },
  {
    href: "/testimoni",
    label: "Testimoni",
    icon: MessageSquareQuote,
    mobile: "more",
    description: "Cerita para orang tua",
  },
  { href: "/contact", label: "Contact", icon: Mail, mobile: "more", description: "WhatsApp, email & alamat" },
];

export const primaryMobileNav = navigation.filter((item) => item.mobile === "primary");
export const moreMobileNav = navigation.filter((item) => item.mobile === "more");

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
