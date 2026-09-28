import type { ReactNode } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileHeader } from "./MobileHeader";
import { TopSearchBar } from "./TopSearchBar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-brand-yellow focus:px-4 focus:py-2 focus:font-semibold focus:text-on-accent"
      >
        Lewati ke konten
      </a>
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        <TopSearchBar />
        <main
          id="konten"
          className="mx-auto w-full max-w-[1320px] flex-1 px-5 pt-2 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom)+28px)] md:px-8 md:pt-4 md:pb-12 xl:px-10"
        >
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
