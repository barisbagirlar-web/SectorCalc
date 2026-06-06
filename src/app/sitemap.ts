import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { INDUSTRIES } from "@/data/industries";
import { ALL_TOOLS } from "@/data/tools";
import { locales } from "@/i18n/routing";

const STATIC_ROUTES = [
  "/",
  "/free-tools",
  "/premium-tools",
  "/how-it-works",
  "/industries",
  "/pricing",
  "/for-consultants",
  "/reports/sample-decision-report",
  "/cnc-quote-risk",
  "/construction-bid-margin",
  "/cleaning-contract-margin",
  "/privacy",
  "/terms",
  "/disclaimer",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_ROUTES) {
      entries.push({
        url: `${base}/${locale}${path === "/" ? "" : path}`,
        lastModified: now,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.8,
      });
    }

    for (const industry of INDUSTRIES) {
      entries.push({
        url: `${base}/${locale}${industry.href}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    for (const tool of ALL_TOOLS) {
      entries.push({
        url: `${base}/${locale}${tool.href}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: tool.tier === "premium" ? 0.75 : 0.7,
      });
    }
  }

  return entries;
}
