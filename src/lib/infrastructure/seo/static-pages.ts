import type { SitemapChangeFrequency } from "@/lib/infrastructure/seo/sitemap-manifest";

export type StaticPageConfig = {
  readonly path: string;
  readonly changeFrequency: SitemapChangeFrequency;
  readonly priority: number;
};

/** Core marketing and legal pages — priority/changefreq tuned for crawl budget. */
export function getStaticPages(_locale?: string): StaticPageConfig[] {
  return [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.85 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.5 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.5 },
    { path: "/refund-policy", changeFrequency: "yearly", priority: 0.5 },
    { path: "/disclaimer", changeFrequency: "yearly", priority: 0.5 },
  ];
}
