import { getArticles } from "@/lib/articles-service";
import { articleHref } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const revalidate = 3600;

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Umpan RSS artikel — membantu Google & pembaca feed menemukan artikel baru lebih cepat. */
export async function GET() {
  const articles = (await getArticles()).slice(0, 30);
  const items = articles
    .map((a) => {
      const url = absoluteUrl(articleHref(a));
      return `<item><title>${escape(a.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate><category>${escape(a.category)}</category><description>${escape(a.excerpt)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escape(siteConfig.name)} — Artikel</title><link>${absoluteUrl("/artikel")}</link><description>${escape(siteConfig.description)}</description><language>id-ID</language><atom:link href="${absoluteUrl("/artikel/feed.xml")}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
