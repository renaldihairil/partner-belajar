"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, ExternalLink, LogOut, Menu, UserCog, X } from "lucide-react";
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

const roleLabel = (role: string) => (role === "owner" ? "Pemilik" : "Editor");

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
      <Image src="/icons/icon-192.png" alt="" width={40} height={40} className="size-10 rounded-xl" priority />
      <span className="leading-tight">
        <span className="block text-[15px] font-bold text-ink">Partner Belajar</span>
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
          <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-wider text-ink-soft/70 uppercase">{group.label}</p>
          <ul className="flex flex-col gap-1">
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = isAdminNavActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`group flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-all ${
                      active
                        ? "bg-[var(--adm-active)] text-white shadow-[0_6px_14px_-6px_rgb(16_144_138/0.7)]"
                        : "text-ink-soft hover:bg-[var(--adm-hover)] hover:text-ink"
                    }`}
                  >
                    <Icon aria-hidden className={`size-[19px] ${active ? "text-white" : "text-ink-soft group-hover:text-brand-teal"}`} />
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

function SidebarContent({ admin, pathname, onNavigate }: { admin: Admin; pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Brand />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <NavLinks admin={admin} pathname={pathname} onNavigate={onNavigate} />
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
        >
          <LogOut aria-hidden className="size-[19px]" />
          Keluar
        </button>
      </form>
    </div>
  );
}

/** Chip pengguna di bilah atas: nama + peran, menu Akun Saya & Keluar. */
function UserMenu({ admin }: { admin: Admin }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-2.5 rounded-xl border border-line bg-surface pr-2.5 pl-1.5 shadow-soft transition-colors hover:bg-[var(--adm-hover)]"
      >
        <span aria-hidden className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-brand-teal to-brand-teal-strong text-[11px] font-bold text-white">
          {initials(admin.name)}
        </span>
        <span className="hidden max-w-32 truncate text-sm font-semibold text-ink sm:block">{admin.name}</span>
        <ChevronDown aria-hidden className={`size-4 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="menu" className="adm-fade-in absolute right-0 z-50 mt-2 w-64 overflow-clip rounded-2xl border border-line bg-surface p-1.5 shadow-lift">
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-ink">{admin.name}</p>
            <p className="truncate text-xs text-ink-soft">{admin.email}</p>
            <span className="mt-1.5 inline-block rounded-full bg-brand-teal-soft px-2 py-0.5 text-[11px] font-semibold text-brand-teal-dark">{roleLabel(admin.role)}</span>
          </div>
          <div className="my-1 h-px bg-line" />
          <Link
            href="/admin/akun"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm font-medium text-ink transition-colors hover:bg-[var(--adm-hover)]"
          >
            <UserCog aria-hidden className="size-4 text-ink-soft" />
            Akun saya
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <LogOut aria-hidden className="size-4" />
              Keluar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/** Kerangka admin: sidebar (desktop), laci menu (mobile), bilah atas dengan breadcrumb & menu pengguna. */
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
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-line bg-[var(--adm-sidebar)] shadow-[4px_0_24px_-12px_rgb(16_90_84/0.15)] lg:block">
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
          className="fixed inset-y-0 left-0 z-50 w-72 -translate-x-full border-r border-line bg-[var(--adm-sidebar)] shadow-lift transition-transform duration-200 data-[open=true]:translate-x-0"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
            className="absolute top-5 right-3 grid size-8 place-items-center rounded-lg text-ink-soft hover:bg-[var(--adm-hover)]"
          >
            <X aria-hidden className="size-4" />
          </button>
          <SidebarContent admin={admin} pathname={pathname} onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-[color-mix(in_srgb,var(--background)_82%,transparent)] px-4 backdrop-blur-md md:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            aria-expanded={open}
            className="-ml-1 grid size-10 place-items-center rounded-xl text-ink-soft hover:bg-[var(--adm-hover)] lg:hidden"
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
                      <span aria-current="page" className="truncate font-semibold text-ink">
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
            className="hidden h-10 items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 text-[13px] font-semibold text-ink-soft shadow-soft transition-colors hover:bg-[var(--adm-hover)] hover:text-ink sm:inline-flex"
          >
            Lihat situs
            <ExternalLink aria-hidden className="size-3.5" />
          </Link>
          <ThemeToggle className="!size-10 !rounded-xl !bg-surface shadow-soft [&_svg]:!size-4" />
          <UserMenu admin={admin} />
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-3 pb-10 md:px-8">{children}</main>
      </div>
    </div>
  );
}
