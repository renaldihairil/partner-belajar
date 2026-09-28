import { ClipboardCheck, HeartHandshake, MessageCircle, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { TeacherExplorer } from "@/components/teachers/TeacherExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { teachers } from "@/data/teachers";
import { pageMetadata } from "@/lib/metadata";
import { getProgramsWithClasses } from "@/lib/programs-service";
import { whatsappUrl } from "@/lib/whatsapp";

const description = "Kenali para pengajar yang sabar, terlatih, dan siap mendampingi anak belajar dengan penuh kasih.";

export const metadata = pageMetadata({
  title: "Pengajar — Partner Belajar",
  description,
  path: "/pengajar",
});

const standards: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ShieldCheck, title: "Seleksi berlapis", text: "Tes kompetensi, micro-teaching, dan wawancara adab." },
  { icon: Sparkles, title: "Pelatihan rutin", text: "Metode mengajar anak yang interaktif dan menyenangkan." },
  { icon: ClipboardCheck, title: "Evaluasi berkala", text: "Kualitas kelas dipantau dan ditingkatkan terus." },
  { icon: HeartHandshake, title: "Dekat dengan orang tua", text: "Komunikasi & laporan perkembangan yang jelas." },
];

export default async function PengajarPage() {
  const programs = await getProgramsWithClasses();

  return (
    <>
      <PageHeader title="Pengajar" description={description} />

      <Reveal>
        <ul className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {standards.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-[22px] bg-brand-teal-soft p-4">
              <Icon aria-hidden className="size-6 text-brand-teal-dark" />
              <p className="mt-2 text-sm font-bold text-ink">{title}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <TeacherExplorer teachers={teachers} programs={programs} />

      <Reveal className="mt-12">
        <section
          aria-labelledby="karier-title"
          className="stats-band relative isolate flex flex-col items-start gap-4 overflow-clip rounded-[28px] p-6 text-white md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div aria-hidden className="stats-dots absolute inset-0 -z-10" />
          <div>
            <h2 id="karier-title" className="text-xl font-extrabold md:text-2xl">
              Ingin bergabung menjadi pengajar?
            </h2>
            <p className="mt-1 text-sm text-white/85 md:text-base">
              Kami mencari pendidik yang sabar dan mencintai dunia anak. Kirim profil singkat Anda via WhatsApp.
            </p>
          </div>
          <a
            href={whatsappUrl("Assalamu'alaikum Admin Partner Belajar, saya tertarik bergabung menjadi pengajar.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-brand-yellow px-6 text-[15px] font-bold text-on-accent transition-all hover:-translate-y-0.5 hover:bg-[#fac93f]"
          >
            <MessageCircle aria-hidden className="size-5" />
            Kirim Profil
          </a>
        </section>
      </Reveal>
    </>
  );
}
