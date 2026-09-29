"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronRight, ExternalLink, LogOut, Menu, X } from "lucide-react";
import { logoutAction } from "@/app/admin/actions/auth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { breadcrumbsFor, isAdminNavActive, visibleNavGroups } from "./nav";

type Admin = { name: string; email: string; role: string; permissions: string[] };

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
      <Image src="/icons/icon-192.png" alt="" width={32} height={32} className="size-8 rounded-lg" priority />
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-ink">Partner Belajar</span>
        <span className="block text-[11px] font-medium text-ink-soft">Admin Panel</span>
      </span>
    </Link>
  );
}

function NavLinks({ admin, pathname, onNavigate }: { admin: Admin; pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Menu admin" className="flex flex-col gap-5">
      {visibleNavGroups(admin).map((group) => (
        <div key={group.label}>
          <p className="mb-1 px-3 text-[11px] font-semibold tracking-wider text-ink-soft/80 uppercase">{group.label}</p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = isAdminNavActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                      active ? "bg-[var(--adm-active)] text-brand-teal-dark" : "text-ink-soft hover:bg-[var(--adm-hover)] hover:text-ink"
                    }`}
                  >
                    {active && <span aria-hidden className="absolute top-2 bottom-2 -left-3 w-[3px] rounded-r-full bg-brand-teal" />}
                    <Icon aria-hidden className={`size-[18px] ${active ? "text-brand-teal" : "text-ink-soft group-hover:text-ink"}`} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function UserCard({ admin }: { admin: Admin }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-2.5 shadow-soft">
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-teal to-brand-teal-strong text-xs font-semibold text-white">
        {initials(admin.name)}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-sm font-medium text-ink">{admin.name}</span>
        <span className="block truncate text-xs text-ink-soft">{admin.role === "owner" ? "Pemilik" : "Editor"} · {admin.email}</span>
      </span>
      <form action={logoutAction}>
        <button
          type="submit"
          aria-label="Keluar"
          title="Keluar"
          className="grid size-8 place-items-center rounded-md text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
        >
          <LogOut aria-hidden className="size-4" />
        </button>
      </form>
    </div>
  );
}

function SidebarContent({ admin, pathname, onNavigate }: { admin: Admin; pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Brand />
      <div className="min-h-0 flex-1 overflow-y-auto pl-3">
        <div className="-ml-3">
          <NavLinks admin={admin} pathname={pathname} onNavigate={onNavigate} />
        </div>
      </div>
      <UserCard admin={admin} />
    </div>
  );
}

/** Kerangka admin: sidebar (desktop), laci menu (mobile), bilah atas dengan breadcrumb. */
export function AdminChrome({ admin, children }: { admin: Admin; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const crumbs = breadcrumbsFor(pathname);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-line bg-[var(--adm-sidebar)] lg:block">
        <SidebarContent admin={admin} pathname={pathname} />
      </aside>

      {/* Laci menu mobile */}
      <div className="lg:hidden">
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          data-open={open}
          className="pointer-events-none fixed inset-0 z-40 bg-black/40 opacity-0 transition-opacity data-[open=true]:pointer-events-auto data-[open=true]:opacity-100"
        />
        <aside
          aria-label="Menu admin"
          inert={!open}
          data-open={open}
          className="fixed inset-y-0 left-0 z-50 w-72 -translate-x-full data-[open=true]:translate-x-0 border-r border-line bg-[var(--adm-sidebar)] shadow-lift transition-transform duration-200"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
            className="absolute top-5 right-3 grid size-8 place-items-center rounded-md text-ink-soft hover:bg-[var(--adm-hover)]"
          >
            <X aria-hidden className="size-4" />
          </button>
          <SidebarContent admin={admin} pathname={pathname} onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur-md md:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            aria-expanded={open}
            className="-ml-1 grid size-9 place-items-center rounded-lg text-ink-soft hover:bg-[var(--adm-hover)] lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </button>
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex min-w-0 items-center gap-1 text-sm">
              {crumbs.map((crumb, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={crumb.href} className={`flex min-w-0 items-center gap-1 ${i < crumbs.length - 2 ? "hidden sm:flex" : ""}`}>
                    {i > 0 && <ChevronRight aria-hidden className="size-3.5 shrink-0 text-ink-soft/60" />}
                    {last ? (
                      <span aria-current="page" className="truncate font-medium text-ink">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link href={crumb.href} className="truncate text-ink-soft transition-colors hover:text-ink">
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
          <Link
            href="/"
            target="_blank"
            className="hidden h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] font-medium text-ink-soft shadow-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink sm:inline-flex"
          >
            Lihat situs
            <ExternalLink aria-hidden className="size-3.5" />
          </Link>
          <ThemeToggle className="!size-8 !rounded-lg !bg-surface shadow-soft [&_svg]:!size-4" />
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
