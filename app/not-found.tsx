import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { SiteChrome } from "@/components/layout/SiteChrome";

/** URL yang tidak cocok dengan rute mana pun (di luar layout situs) — tetap tampil dengan kerangka situs. */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
