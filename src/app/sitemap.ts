import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { INDUSTRIES } from "@/data/industries";
import { ALL_TOOLS } from "@/data/tools";

const STATIC_ROUTES = [
  "/",
  "/free-tools",
  "/industries",
  "/pricing",
  "/for-consultants",
  "/reports/sample-decision-report",
  "/privacy",
  "/terms",
  "/disclaimer",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const industryEntries: MetadataRoute.Sitemap = INDUSTRIES.map((industry) => ({
    url: `${base}${industry.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const toolEntries: MetadataRoute.Sitemap = ALL_TOOLS.map((tool) => ({
    url: `${base}${tool.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: tool.tier === "premium" ? 0.75 : 0.7,
  }));

  return [...staticEntries, ...industryEntries, ...toolEntries];
}
