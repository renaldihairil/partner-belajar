import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, GraduationCap, ListTree, Share2, Tag } from "lucide-react";
import { ArticleBody } from "@/components/artikel/ArticleBody";
import { ArticleCard } from "@/components/artikel/ArticleCard";
import { ArticleToc } from "@/components/artikel/ArticleToc";
import { ReadingProgress } from "@/components/artikel/ReadingProgress";
import { ShareBar } from "@/components/artikel/ShareButton";
import { Reveal } from "@/components/ui/Reveal";
import {
  articleHref,
  authorInitials,
  categoryStyles,
  headingId,
  readingMinutes,
} from "@/lib/articles";
import { getArticleBySlug, getArticles, pickRelatedArticles } from "@/lib/articles-service";
import { formatDateLongId } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

type PageProps = { params: Promise<{ slug: string }> };

/** Artikel baru dari admin dibuat saat pertama dibuka; slug yang tidak ada → 404. */
export async function generateStaticParams() {
  return (await getArticles()).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return pageMetadata({
    title: `${article.title} — Artikel Partner Belajar`,
    description: article.excerpt,
    path: articleHref(article),
    image: { url: article.image, width: 1200, height: 750, alt: article.imageAlt },
    article: { publishedTime: article.date, authors: [article.author.name], tags: article.tags },
  });
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const href = articleHref(article);
  const style = categoryStyles[article.category];
  const minutes = readingMinutes(article);
  const toc = article.content
    .filter((block) => block.type === "h2")
    .map((block) => ({ id: headingId(block.text), text: block.text }));
  const related = pickRelatedArticles(await getArticles(), article);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: absoluteUrl(article.image),
    datePublished: article.date,
    author: { "@type": "Person", name: article.author.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo.src) },
    },
    mainEntityOfPage: absoluteUrl(href),
    keywords: article.tags.join(", "),
  };

  return (
    <>
      <ReadingProgress targetId="isi-artikel" />

      <nav aria-label="Breadcrumb" className="animate-rise mb-5 flex items-center gap-2 text-sm">
        <Link
          href="/artikel"
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-surface px-4 font-semibold text-ink ring-1 ring-line transition-colors hover:text-brand-teal-dark hover:ring-brand-teal/40"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Semua artikel
        </Link>
        <span aria-hidden className="text-ink-soft">/</span>
        <Link
          href={`/artikel?kategori=${encodeURIComponent(article.category)}`}
          className="font-medium text-ink-soft transition-colors hover:text-brand-teal-dark"
        >
          {article.category}
        </Link>
      </nav>

      <article>
        <header className="animate-rise mx-auto max-w-3xl text-center">
          <span className={`inline-block rounded-full px-3.5 py-1 text-[12.5px] font-bold ${style.chip}`}>
            {article.category}
          </span>
          <h1 className="mt-3 text-[28px] leading-[1.18] font-extrabold tracking-tight text-ink text-balance md:text-[42px]">
            {article.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft md:text-lg">{article.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className={`grid size-9 place-items-center rounded-full text-[12px] font-bold text-white ${style.dot}`}
              >
                {authorInitials(article.author.name)}
              </span>
              <span className="text-left leading-tight">
                <span className="block font-semibold text-ink">{article.author.name}</span>
                <span className="block text-xs">{article.author.role}</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden className="size-4" />
              <time dateTime={article.date}>{formatDateLongId(article.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 aria-hidden className="size-4" />
              {minutes} menit baca
            </span>
          </div>
        </header>

        <div className={`animate-rise relative mx-auto mt-7 aspect-[16/10] max-w-5xl overflow-clip rounded-[28px] shadow-soft md:mt-9 ${style.soft}`}>
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            priority
            sizes="(min-width: 1280px) 1024px, 92vw"
            className="object-cover"
          />
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-8 md:mt-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          <div id="isi-artikel" className="min-w-0">
            <ArticleBody blocks={article.content} />

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Tag aria-hidden className="size-4 text-ink-soft" />
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/artikel?q=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-background px-3 py-1 text-[13px] font-medium text-ink-soft ring-1 ring-line transition-colors hover:text-brand-teal-dark hover:ring-brand-teal/40"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-[24px] border border-line bg-surface p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-ink">Artikel ini bermanfaat?</p>
                <p className="text-sm text-ink-soft">Bagikan kepada orang tua lain yang membutuhkan.</p>
              </div>
              <ShareBar path={href} title={article.title} siteUrl={siteConfig.url} />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6 flex flex-col gap-5">
              {toc.length > 0 && (
                <nav aria-label="Daftar isi" className="rounded-[22px] border border-line bg-surface p-4 shadow-soft">
                  <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                    <ListTree aria-hidden className="size-4 text-brand-teal" />
                    Daftar isi
                  </p>
                  <ArticleToc items={toc} />
                </nav>
              )}
              <div className="rounded-[22px] border border-line bg-surface p-4 shadow-soft">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                  <Share2 aria-hidden className="size-4 text-brand-teal" />
                  Bagikan
                </p>
                <ShareBar path={href} title={article.title} siteUrl={siteConfig.url} />
              </div>
              <div className="stats-band relative isolate overflow-clip rounded-[22px] p-5 text-white">
                <div aria-hidden className="stats-dots absolute inset-0 -z-10" />
                <GraduationCap aria-hidden className="size-7 text-brand-yellow" />
                <p className="mt-2 font-bold leading-snug">Belajar lebih terarah bersama pengajar kami</p>
                <Link
                  href="/program"
                  className="mt-4 inline-flex min-h-10 items-center rounded-full bg-brand-yellow px-4 text-sm font-bold text-on-accent transition-all hover:brightness-105"
                >
                  Lihat Program
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="terkait-title" className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 id="terkait-title" className="text-2xl font-bold text-ink md:text-[28px]">
              Artikel terkait
            </h2>
            <Link href="/artikel" className="shrink-0 text-sm font-semibold text-brand-teal-dark hover:underline">
              Lihat semua
            </Link>
          </div>
          <ul className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {related.map((item, index) => (
              <Reveal as="li" key={item.id} delay={index * 80} className="article-item">
                <ArticleCard article={item} siteUrl={siteConfig.url} headingLevel="h3" />
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
