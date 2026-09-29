import { BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/artikel/ArticleCard";
import { ArticleExplorer } from "@/components/artikel/ArticleExplorer";
import { FeaturedArticle } from "@/components/artikel/FeaturedArticle";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { articleCategories, getSortedArticles } from "@/lib/articles";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

const description = "Temukan berbagai tips, informasi, dan inspirasi seputar pendidikan dan pengembangan diri.";

export const metadata = pageMetadata({
  title: "Artikel Pendidikan — Partner Belajar",
  description,
  path: "/artikel",
});

export default function ArtikelPage() {
  const sorted = getSortedArticles();
  const featured = sorted.find((article) => article.featured) ?? sorted[0];

  if (sorted.length === 0) {
    return (
      <>
        <PageHeader title="Artikel" description={description} mobileTone="yellow" />
        <p className="rounded-[var(--radius-card)] bg-background p-6 text-ink-soft">Belum ada artikel. Nantikan segera!</p>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Artikel" description={description} mobileTone="yellow" />

      <ArticleExplorer
        categories={articleCategories.filter((c) => sorted.some((a) => a.category === c))}
        featured={{ id: featured.id, node: <FeaturedArticle article={featured} siteUrl={siteConfig.url} /> }}
        items={sorted.map((article, index) => ({
          id: article.id,
          category: article.category,
          searchText: [article.title, article.excerpt, article.category, article.author.name, ...article.tags].join(" "),
          card: <ArticleCard article={article} siteUrl={siteConfig.url} priority={index < 3} />,
        }))}
      />

      <Reveal className="mt-12">
        <section
          aria-labelledby="artikel-cta-title"
          className="stats-band relative isolate flex flex-col items-start gap-4 overflow-clip rounded-[28px] p-6 text-white md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div aria-hidden className="stats-dots absolute inset-0 -z-10" />
          <div className="flex items-start gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-yellow text-on-accent">
              <BookOpen aria-hidden className="size-6" />
            </span>
            <div>
              <h2 id="artikel-cta-title" className="text-xl font-extrabold md:text-2xl">
                Ingin anak belajar lebih terarah?
              </h2>
              <p className="mt-1 text-sm text-white/85 md:text-base">
                Praktikkan tips di atas bersama pengajar Partner Belajar yang sabar dan berpengalaman.
              </p>
            </div>
          </div>
          <Link
            href="/program"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-brand-yellow px-6 text-[15px] font-bold text-on-accent transition-all hover:-translate-y-0.5 hover:brightness-105"
          >
            <GraduationCap aria-hidden className="size-5" />
            Lihat Program
          </Link>
        </section>
      </Reveal>
    </>
  );
}
