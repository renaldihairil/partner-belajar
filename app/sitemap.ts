import type { MetadataRoute } from "next";
import { navigation } from "@/components/navigation/navigation-config";
import { getArticles } from "@/lib/articles-service";
import { getProgramsWithClasses } from "@/lib/programs-service";
import { absoluteUrl } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const [programs, articles] = await Promise.all([getProgramsWithClasses(), getArticles()]);
  const pages: MetadataRoute.Sitemap = navigation.map(({ href }) => ({
    url: absoluteUrl(href),
    lastModified,
    changeFrequency: href === "/artikel" ? "weekly" : "monthly",
    priority: href === "/" ? 1 : 0.8,
  }));
  const programPages: MetadataRoute.Sitemap = programs.map((program) => ({
    url: absoluteUrl(`/program/${program.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/artikel/${article.slug}`),
    lastModified: new Date(article.updatedAt ?? article.date),
    images: [absoluteUrl(article.image)],
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...pages, ...programPages, ...articlePages];
}
