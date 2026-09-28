import type { ReactNode } from "react";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";
import { whatsappUrl } from "@/lib/whatsapp";
import { OpeningStatusBadge } from "./OpeningStatusBadge";

type Channel = {
  id: string;
  icon: LucideIcon;
  label: string;
  lines: readonly string[];
  action?: { label: string; href: string; external?: boolean };
  tone: string;
  highlight?: boolean;
  extra?: ReactNode;
};

export function ContactChannels({ generatedAt }: { generatedAt: number }) {
  const { contact } = siteConfig;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address.join(", "))}`;

  const channels: Channel[] = [
    {
      id: "whatsapp",
      icon: MessageCircle,
      label: "WhatsApp",
      lines: [contact.phone],
      action: { label: "Chat sekarang", href: whatsappUrl(), external: true },
      tone: "bg-[#1faf55] text-white",
      highlight: true,
    },
    {
      id: "email",
      icon: Mail,
      label: "Email",
      lines: [contact.email],
      action: { label: "Kirim email", href: `mailto:${contact.email}` },
      tone: "bg-brand-yellow-soft text-warn",
    },
    {
      id: "alamat",
      icon: MapPin,
      label: "Alamat",
      lines: contact.address,
      action: { label: "Buka di Maps", href: mapsUrl, external: true },
      tone: "bg-soft-blue text-brand-teal-dark",
    },
    {
      id: "jam",
      icon: Clock,
      label: "Jam Operasional",
      lines: contact.hours,
      tone: "bg-soft-purple text-accent-purple-ink",
      extra: <OpeningStatusBadge generatedAt={generatedAt} className="mt-3 !px-2.5 !py-1 !text-[11.5px]" />,
    },
  ];

  return (
    <section aria-label="Informasi kontak" className="mt-6">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {channels.map((channel, index) => (
          <Reveal as="li" key={channel.id} delay={index * 80}>
            <div
              className={`group relative flex h-full flex-col rounded-[var(--radius-card)] border bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
                channel.highlight ? "border-[#1faf55]/30 ring-1 ring-[#1faf55]/15" : "border-line"
              }`}
            >
              <span
                className={`grid size-12 place-items-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${channel.tone}`}
              >
                <channel.icon aria-hidden className="size-6" strokeWidth={2} />
              </span>
              <h2 className="mt-4 text-[15px] font-bold text-ink">{channel.label}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {channel.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              {channel.extra}
              {channel.action && (
                <a
                  href={channel.action.href}
                  {...(channel.action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`mt-auto inline-flex min-h-11 items-center gap-1 self-start pt-3 text-sm font-semibold transition-colors ${
                    channel.highlight ? "text-wa hover:opacity-80" : "text-brand-teal-dark hover:text-ink"
                  }`}
                >
                  {channel.action.label}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
