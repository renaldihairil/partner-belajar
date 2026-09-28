import { MessageCircle } from "lucide-react";
import { RegisterButton } from "@/components/registration/RegisterButton";
import { formatRupiah } from "@/lib/whatsapp";
import type { ProgramWithClasses } from "@/types";

/** Bar pendaftaran yang menempel di atas bottom navigation (khusus mobile). */
export function StickyRegisterBar({ program }: { program: ProgramWithClasses }) {
  const lowest = Math.min(...program.pricing.map((p) => p.price));
  return (
    <>
      {/* Spacer agar konten terakhir tidak tertutup bar */}
      <div aria-hidden className="h-16 md:hidden" />
      <div className="fixed inset-x-0 bottom-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] z-30 border-t border-line bg-surface/95 px-4 py-2.5 shadow-[0_-10px_24px_-18px_rgb(21_95_91/0.45)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-bold text-ink">{program.title}</p>
            <p className="text-[12px] text-ink-soft">
              Mulai <strong className="font-semibold text-ink">{formatRupiah(lowest)}</strong>/pertemuan
            </p>
          </div>
          <RegisterButton
            programSlug={program.slug}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-[#1faf55] px-4 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgb(31_175_85/0.95)]"
          >
            <MessageCircle aria-hidden className="size-4" />
            Daftar
          </RegisterButton>
        </div>
      </div>
    </>
  );
}
