import Image from "next/image";
import { ArrowDown, HeartHandshake, MessageCircle } from "lucide-react";
import { RegisterButton } from "@/components/registration/RegisterButton";
import { LeafCloud } from "@/components/ui/Decor";
import { OpeningStatusBadge } from "./OpeningStatusBadge";

export function ContactHero({ generatedAt }: { generatedAt: number }) {
  return (
    <section
      aria-labelledby="contact-title"
      className="stats-band relative isolate -mx-5 -mt-2 overflow-clip rounded-b-[36px] text-white md:mx-0 md:mt-0 md:rounded-[32px]"
    >
      {/* Latar bergerak — sama dengan section statistik di Home */}
      <div aria-hidden className="stats-dots absolute inset-0 -z-10" />
      <div aria-hidden className="hero-blob stats-blob stats-blob--yellow" />
      <div aria-hidden className="hero-blob stats-blob stats-blob--mint" />
      <LeafCloud className="pointer-events-none absolute -bottom-6 -left-8 -z-10 w-40 text-white/10" />

      <div className="grid items-end lg:grid-cols-[1.05fr_1fr]">
        {/* Teks */}
        <div className="animate-rise relative z-10 self-center px-6 pt-8 md:px-10 md:pt-12 lg:py-14 lg:pr-4 lg:pl-12">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/12 py-1.5 pr-4 pl-2 text-[13px] font-medium ring-1 ring-white/20 backdrop-blur">
            <span className="grid size-6 place-items-center rounded-full bg-brand-yellow text-on-accent">
              <HeartHandshake aria-hidden className="size-3.5" strokeWidth={2.4} />
            </span>
            Hubungi kami
          </p>
          <h1 id="contact-title" className="mt-4 text-[40px] leading-[1.05] font-extrabold tracking-tight md:text-[56px]">
            Contact
          </h1>
          <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-white/90 md:text-lg">
            Kami siap membantu Anda. Silakan hubungi kami melalui informasi di bawah ini, atau konsultasikan kebutuhan
            belajar anak langsung via WhatsApp.
          </p>

          <OpeningStatusBadge generatedAt={generatedAt} tone="dark" className="mt-5" />

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#kirim-pesan"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-yellow px-6 text-[15px] font-bold text-on-accent shadow-[0_12px_24px_-14px_rgb(0_0_0/0.5)] transition-all hover:-translate-y-0.5 hover:bg-[#fac93f]"
            >
              <MessageCircle aria-hidden className="size-5" />
              Kirim Pesan
              <ArrowDown aria-hidden className="size-4" />
            </a>
            <RegisterButton className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-[15px] font-semibold text-white ring-1 ring-white/50 transition-colors hover:bg-white/10">
              Daftar Program
            </RegisterButton>
          </div>
        </div>

        {/* Visual: karakter + gelembung chat & kilau beranimasi */}
        <div className="relative mx-auto mt-8 w-full max-w-[420px] px-4 sm:max-w-[480px] lg:mt-0 lg:max-w-[580px] lg:px-0 lg:pt-12">
          <div
            aria-hidden
            className="absolute inset-x-[10%] top-[8%] aspect-square rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.22)_0%,rgb(255_255_255/0.08)_45%,transparent_70%)]"
          />
          <div aria-hidden className="hero-orbit absolute inset-x-[12%] top-[10%] aspect-square rounded-full border-2 border-dashed border-white/20">
            <span className="absolute top-[10%] left-[14%] size-3 rounded-full bg-brand-yellow shadow-[0_0_0_5px_rgb(248_192_48/0.25)]" />
          </div>

          <div className="contact-character relative ml-auto w-[88%]">
            <Image
              src="/characters/contact-admin.webp"
              alt="Ilustrasi admin Partner Belajar berhijab memakai headset di depan laptop, siap membantu"
              width={1100}
              height={834}
              sizes="(min-width: 1024px) 510px, 80vw"
              priority
              className="h-auto w-full drop-shadow-[0_24px_30px_rgb(0_0_0/0.25)]"
            />
            {/* Garis kilau di samping kepala */}
            <span aria-hidden className="contact-sparks absolute top-[3%] right-[1%] w-[14%]">
              <span className="spark bg-brand-yellow" />
              <span className="spark bg-[#2ec4b6]" />
              <span className="spark bg-[#2ec4b6]" />
            </span>
          </div>

          {/* Gelembung chat "sedang mengetik" */}
          <div aria-hidden className="chat-bubble absolute top-[18%] left-[2%] sm:left-[4%] lg:top-[24%]">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      </div>
    </section>
  );
}
