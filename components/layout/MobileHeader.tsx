import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

/** Header mobile: logo + tombol mode terang/gelap (navigasi ada di bottom nav). */
export function MobileHeader() {
  return (
    <header className="relative z-30 flex items-center justify-between px-5 pt-4 pb-2 md:hidden">
      <Logo priority className="w-[118px]" />
      <ThemeToggle />
    </header>
  );
}
