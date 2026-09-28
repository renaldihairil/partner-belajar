import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type NavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  variant: "sidebar" | "bottom";
};

export function NavItem({ href, label, icon: Icon, active, variant }: NavItemProps) {
  if (variant === "bottom") {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] transition-colors ${
          active ? "font-bold text-brand-teal-dark" : "font-medium text-ink-soft hover:text-ink"
        }`}
      >
        <Icon
          aria-hidden
          className={`size-6 ${active ? "text-brand-teal" : "text-muted"}`}
          strokeWidth={active ? 2.4 : 1.8}
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.18 : 0}
        />
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group flex min-h-11 items-center gap-3 rounded-full px-4 py-2.5 text-[15px] transition-all duration-200 ${
        active
          ? "bg-brand-teal-strong font-semibold text-white shadow-[0_8px_18px_-10px_rgb(14_127_122/0.8)]"
          : "font-medium text-ink-soft hover:bg-brand-teal-soft hover:text-ink"
      }`}
    >
      <Icon
        aria-hidden
        className={`size-5 shrink-0 ${active ? "text-white" : "text-ink-soft group-hover:text-brand-teal"}`}
        strokeWidth={active ? 2.2 : 1.8}
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.25 : 0}
      />
      {label}
    </Link>
  );
}
