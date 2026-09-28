import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SearchBar } from "@/components/ui/SearchBar";

/** Area utilitas atas di desktop/tablet: pencarian (visual, Phase 1) + mode terang/gelap. */
export function TopSearchBar() {
  return (
    <div className="mx-auto hidden w-full max-w-[1320px] items-center justify-between gap-6 px-8 pt-6 md:flex xl:px-10">
      <SearchBar className="w-full max-w-[380px]" />
      <ThemeToggle />
    </div>
  );
}
