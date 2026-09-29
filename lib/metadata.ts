import type { Metadata } from "next";
import { siteConfig } from "./site-config";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Gambar Open Graph khusus (default: og-image situs). */
  image?: { url: string; width: number; height: number; alt: string };
  /** Data tambahan untuk halaman artikel. */
  article?: { publishedTime: string; modifiedTime?: string; authors: string[]; tags: string[]; section?: string };
};

/** Metadata per halaman: title unik, description, canonical, dan Open Graph. */
export function pageMetadata({ title, description, path, image, article }: PageMetaInput): Metadata {
  const ogImage = image ?? { url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name };
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
      types: { "application/rss+xml": [{ url: "/artikel/feed.xml", title: `Artikel ${siteConfig.name}` }] },
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [ogImage],
      ...(article
        ? { type: "article", publishedTime: article.publishedTime, modifiedTime: article.modifiedTime, authors: article.authors, tags: article.tags, section: article.section }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
