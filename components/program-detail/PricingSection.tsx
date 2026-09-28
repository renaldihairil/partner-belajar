import { ArrowRight, CheckCircle2, UsersRound } from "lucide-react";
import { RegisterButton } from "@/components/registration/RegisterButton";
import { formatRupiah } from "@/lib/whatsapp";
import type { ProgramWithClasses } from "@/types";

export function PricingSection({ program }: { program: ProgramWithClasses }) {
  return (
    <section
      id="harga"
      aria-labelledby="harga-title"
      className="relative -mx-5 scroll-mt-24 overflow-clip bg-[linear-gradient(180deg,var(--background),var(--surface))] px-5 py-12 md:mx-0 md:rounded-[32px] md:px-8 md:py-14"
    >
      <div aria-hidden className="hero-dots absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="text-[13px] font-semibold tracking-wide text-brand-teal uppercase">Daftar harga</p>
        <h2 id="harga-title" className="mt-1.5 text-[30px] leading-tight font-extrabold tracking-tight text-ink md:text-[44px]">
          Pilih Kelas Sesuai <span className="text-gradient-brand">Kebutuhan</span>
        </h2>
        <p className="mt-3 text-[15px] text-ink-soft md:text-[17px]">
          Harga transparan. Tanpa biaya tersembunyi. Bayar per pertemuan sesuai paket.
        </p>
      </div>

      <ul className="relative mx-auto mt-10 grid max-w-5xl items-center gap-5 md:grid-cols-3 md:gap-4 lg:gap-6">
        {program.pricing.map((plan) => (
          <li
            key={plan.id}
            className={`relative flex flex-col rounded-[28px] bg-surface p-6 transition-all duration-300 hover:-translate-y-1 lg:p-7 ${
              plan.popular
                ? "pricing-popular z-10 shadow-[0_30px_60px_-28px_rgb(11_111_106/0.55)] md:py-9"
                : "border border-line shadow-soft hover:shadow-lift"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,var(--brand-teal),var(--brand-yellow))] px-4 py-1.5 text-[11px] font-extrabold tracking-wider whitespace-nowrap text-white uppercase shadow-soft">
                Paling Populer
              </span>
            )}
            <p className="inline-flex items-center gap-2 text-[13px] font-bold tracking-wide text-brand-teal uppercase">
              <UsersRound aria-hidden className="size-[18px]" />
              {plan.label}
            </p>
            <p className="mt-5 text-[40px] leading-none font-extrabold tracking-tight text-ink lg:text-[46px]">
              {formatRupiah(plan.price)}
            </p>
            <p className="mt-2 text-sm text-ink-soft">/{plan.unit}</p>

            <ul className="mt-6 flex flex-col gap-3 text-[15px] text-ink">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <CheckCircle2 aria-hidden className="size-5 shrink-0 text-brand-teal" />
                  {feature}
                </li>
              ))}
            </ul>

            <RegisterButton
              programSlug={program.slug}
              planId={plan.id}
              aria-label={`Pilih paket ${plan.label} — ${formatRupiah(plan.price)} ${plan.unit}`}
              className={`group/btn mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-bold transition-all hover:-translate-y-0.5 ${
                plan.popular
                  ? "bg-[linear-gradient(90deg,var(--brand-teal-strong),var(--brand-teal)_45%,var(--brand-yellow))] text-white shadow-[0_14px_26px_-14px_rgb(14_127_122/0.9)]"
                  : "bg-brand-teal-strong text-white hover:brightness-110"
              }`}
            >
              Pilih Paket
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover/btn:translate-x-1" />
            </RegisterButton>
          </li>
        ))}
      </ul>

      <p className="relative mt-8 text-center text-[13px] text-ink-soft">
        Detail jadwal, pengajar, dan metode pembayaran dikonfirmasi admin melalui WhatsApp.
      </p>
    </section>
  );
}
