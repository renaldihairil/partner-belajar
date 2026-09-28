"use client";

import { usePathname } from "next/navigation";
import { NavItem } from "@/components/navigation/NavItem";
import { isActivePath, navigation } from "@/components/navigation/navigation-config";
import { Logo } from "@/components/ui/Logo";

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-[200px] shrink-0 flex-col border-r border-line bg-surface px-4 pt-8 md:flex lg:w-[var(--sidebar-width)] lg:px-5">
      <div className="px-2">
        <Logo priority className="w-[128px] lg:w-[140px]" />
      </div>
      <nav aria-label="Navigasi utama" className="mt-10">
        <ul className="flex flex-col gap-2">
          {navigation.map((item) => (
            <li key={item.href}>
              <NavItem {...item} variant="sidebar" active={isActivePath(pathname, item.href)} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
