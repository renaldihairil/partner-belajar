import { articles } from "@/data/articles";
import type { Article, ArticleBlock, ArticleCategory } from "@/types";

export const articleCategories: ArticleCategory[] = ["Tips Belajar", "Parenting", "Bahasa", "Islami"];

/** Warna per kategori (chip, aksen, avatar) — memakai token tema agar ikut mode gelap. */
export const categoryStyles: Record<ArticleCategory, { chip: string; soft: string; dot: string }> = {
  "Tips Belajar": { chip: "bg-brand-teal-soft text-brand-teal-dark", soft: "bg-brand-teal-soft", dot: "bg-brand-teal" },
  Parenting: { chip: "bg-brand-yellow-soft text-warn", soft: "bg-brand-yellow-soft", dot: "bg-brand-yellow" },
  Bahasa: { chip: "bg-soft-blue text-[#1c6f99] dark:text-[#8fd0f0]", soft: "bg-soft-blue", dot: "bg-[#3aa5d8]" },
  Islami: { chip: "bg-soft-purple text-accent-purple-ink", soft: "bg-soft-purple", dot: "bg-[#8a6ee0]" },
};

function blockText(block: ArticleBlock): string {
  return block.type === "list" ? block.items.join(" ") : block.text;
}

/** Estimasi waktu baca (± 200 kata per menit, minimal 1 menit). */
export function readingMinutes(article: Pick<Article, "content" | "excerpt">): number {
  const words = [article.excerpt, ...article.content.map(blockText)].join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** "Belajar Bahasa Arab Dasar" → "belajar-bahasa-arab-dasar" (untuk anchor subjudul). */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function articleHref(article: Pick<Article, "slug">): string {
  return `/artikel/${article.slug}`;
}

export function getSortedArticles(): Article[] {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

/** Artikel terkait: kategori sama dulu, lalu yang terbaru. */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const others = getSortedArticles().filter((a) => a.id !== article.id);
  const same = others.filter((a) => a.category === article.category);
  const rest = others.filter((a) => a.category !== article.category);
  return [...same, ...rest].slice(0, limit);
}

/** Inisial untuk avatar penulis: "Kak Nadia Putri" → "NP". */
export function authorInitials(name: string): string {
  const words = name.replace(/^(Ustadzah|Ustadz|Kak)\s+/i, "").split(/\s+/);
  return words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
