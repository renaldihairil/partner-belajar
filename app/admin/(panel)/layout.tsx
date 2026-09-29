import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { requireAdmin } from "@/lib/auth/session";
import { logoutAction } from "../actions/auth";

export default async function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdmin();

  const account = (
    <div className="flex items-center gap-2">
      <Link
        href="/"
        target="_blank"
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-background hover:text-ink"
      >
        <ExternalLink aria-hidden className="size-4" />
        Lihat situs
      </Link>
      <ThemeToggle />
      <form action={logoutAction}>
        <button
          type="submit"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut aria-hidden className="size-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface p-5 lg:flex">
        <Logo className="w-[124px]" />
        <p className="mt-1 mb-6 text-xs font-semibold tracking-wide text-brand-teal uppercase">Admin Panel</p>
        <AdminNav variant="sidebar" />
        <div className="mt-auto rounded-2xl bg-background p-3 text-sm">
          <p className="truncate font-semibold text-ink">{admin.name}</p>
          <p className="truncate text-xs text-ink-soft">{admin.email}</p>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 lg:hidden">
              <Logo className="w-[104px]" />
            </div>
            <p className="hidden text-sm text-ink-soft lg:block">
              Assalamu&apos;alaikum, <span className="font-semibold text-ink">{admin.name}</span>
            </p>
            {account}
          </div>
          <div className="mt-3 lg:hidden">
            <AdminNav variant="bar" />
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
