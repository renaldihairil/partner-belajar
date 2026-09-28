import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { articleHref, authorInitials, categoryStyles, readingMinutes } from "@/lib/articles";
import { formatDateId } from "@/lib/format";
import type { Article } from "@/types";
import { ShareMenu } from "./ShareButton";

type ArticleCardProps = {
  article: Article;
  siteUrl: string;
  priority?: boolean;
  /** Level heading judul (h2 di halaman daftar, h3 di "artikel terkait"). */
  headingLevel?: "h2" | "h3";
};

/**
 * Kartu artikel: seluruh kartu bisa diklik (link "melebar" dari judul),
 * sementara tombol bagikan tetap bisa diklik terpisah di atasnya.
 */
export function ArticleCard({ article, siteUrl, priority, headingLevel: Heading = "h2" }: ArticleCardProps) {
  const href = articleHref(article);
  const style = categoryStyles[article.category];
  const minutes = readingMinutes(article);

  return (
    <article className="article-card group relative flex h-full flex-col rounded-[26px] border border-line bg-surface p-3 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-teal/30 hover:shadow-lift">
      <div className={`relative aspect-[16/10] overflow-clip rounded-[20px] ${style.soft}`}>
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 92vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span aria-hidden className="article-card-shine" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-panel px-3 py-1 text-[12px] font-bold text-ink shadow-sm backdrop-blur-sm">
          <span aria-hidden className={`size-2 rounded-full ${style.dot}`} />
          {article.category}
        </span>
        <span
          aria-hidden
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-brand-yellow text-on-accent shadow-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-teal-strong group-hover:text-white"
        >
          <ArrowUpRight className="size-5" />
        </span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11.5px] font-semibold text-white backdrop-blur-sm">
          <Clock3 aria-hidden className="size-3.5" />
          {minutes} menit baca
        </span>
      </div>

      <div className="flex flex-1 flex-col px-2 pt-4 pb-1">
        <p className="flex items-center gap-1.5 text-xs text-ink-soft">
          <CalendarDays aria-hidden className="size-3.5" />
          <time dateTime={article.date}>{formatDateId(article.date)}</time>
        </p>
        <Heading className="mt-1.5 text-[17px] leading-snug font-bold text-ink md:text-lg">
          <Link
            href={href}
            className="line-clamp-2 bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size,color] duration-300 group-hover:bg-[length:100%_2px] group-hover:text-brand-teal-dark after:absolute after:inset-0 after:rounded-[26px] after:content-[''] focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{article.excerpt}</p>

        <div className="mt-auto flex items-center gap-3 pt-4">
          <span
            aria-hidden
            className={`grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white ${style.dot}`}
          >
            {authorInitials(article.author.name)}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[13px] font-semibold text-ink">{article.author.name}</span>
            <span className="block truncate text-[11.5px] text-ink-soft">{article.author.role}</span>
          </span>
          {/* z-10 agar berada di atas link kartu */}
          <ShareMenu path={href} title={article.title} siteUrl={siteUrl} className="z-10" />
        </div>
      </div>
    </article>
  );
}
