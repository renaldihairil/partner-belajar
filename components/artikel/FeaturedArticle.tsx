import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Sparkles } from "lucide-react";
import { LeafCloud } from "@/components/ui/Decor";
import { articleHref, authorInitials, categoryStyles, readingMinutes } from "@/lib/articles";
import { formatDateId } from "@/lib/format";
import type { Article } from "@/types";
import { ShareMenu } from "./ShareButton";

/** Artikel pilihan: kartu besar di atas grid (gambar kiri, teks kanan di desktop). */
export function FeaturedArticle({ article, siteUrl }: { article: Article; siteUrl: string }) {
  const href = articleHref(article);
  const style = categoryStyles[article.category];

  return (
    <article className="featured-article group relative isolate grid gap-5 rounded-[30px] border border-line bg-surface p-3 shadow-soft transition-shadow duration-300 hover:shadow-lift md:p-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-clip rounded-[30px]">
        <LeafCloud className="absolute -top-4 -right-10 w-48 text-brand-teal-soft" />
      </div>
      <div className={`relative aspect-[16/10] overflow-clip rounded-[24px] ${style.soft}`}>
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 92vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span aria-hidden className="article-card-shine" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-brand-yellow px-3 py-1.5 text-[12px] font-bold text-on-accent shadow-sm">
          <Sparkles aria-hidden className="size-3.5" />
          Artikel Pilihan
        </span>
      </div>

      <div className="flex flex-col px-2 pb-2 lg:py-4 lg:pr-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
          <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${style.chip}`}>{article.category}</span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays aria-hidden className="size-3.5" />
            <time dateTime={article.date}>{formatDateId(article.date)}</time>
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 aria-hidden className="size-3.5" />
            {readingMinutes(article)} menit baca
          </span>
        </div>
        <h2 className="mt-3 text-[24px] leading-tight font-extrabold tracking-tight text-ink md:text-[30px]">
          <Link
            href={href}
            className="transition-colors group-hover:text-brand-teal-dark after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft md:text-base">{article.excerpt}</p>

        <div className="mt-5 flex items-center gap-3">
          <span
            aria-hidden
            className={`grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white ${style.dot}`}
          >
            {authorInitials(article.author.name)}
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-ink">{article.author.name}</span>
            <span className="block text-xs text-ink-soft">{article.author.role}</span>
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3 lg:mt-auto lg:pt-6">
          <span
            aria-hidden
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-teal-strong px-5 text-sm font-semibold text-white transition-all group-hover:gap-3 group-hover:brightness-110"
          >
            Baca artikel
            <ArrowRight className="size-4" />
          </span>
          <ShareMenu path={href} title={article.title} siteUrl={siteUrl} className="z-10" />
        </div>
      </div>
    </article>
  );
}
