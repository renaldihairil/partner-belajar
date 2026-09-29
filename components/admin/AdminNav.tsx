"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, LayoutDashboard, MessageSquareQuote, UserCog, type LucideIcon } from "lucide-react";

export const adminNav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/program", label: "Program & Jadwal", icon: BookOpen },
  { href: "/admin/pengajar", label: "Pengajar", icon: GraduationCap },
  { href: "/admin/testimoni", label: "Testimoni", icon: MessageSquareQuote },
  { href: "/admin/akun", label: "Akun Admin", icon: UserCog },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Menu admin: vertikal di desktop, baris geser di mobile. */
export function AdminNav({ variant }: { variant: "sidebar" | "bar" }) {
  const pathname = usePathname();
  if (variant === "bar") {
    return (
      <nav aria-label="Menu admin" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max gap-1.5">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${
                    active ? "bg-brand-teal-strong text-white" : "bg-surface text-ink-soft ring-1 ring-line"
                  }`}
                >
                  <Icon aria-hidden className="size-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
  return (
    <nav aria-label="Menu admin">
      <ul className="flex flex-col gap-1">
        {adminNav.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-2xl px-4 text-[14.5px] font-semibold transition-colors ${
                  active ? "bg-brand-teal-strong text-white shadow-soft" : "text-ink-soft hover:bg-background hover:text-ink"
                }`}
              >
                <Icon aria-hidden className="size-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
