#!/usr/bin/env tsx

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getSitemapManifest } from "../src/lib/infrastructure/seo/sitemap-manifest";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://sectorcalc.com").replace(/\/+$/, "");
const outputPath = resolve(process.cwd(), process.argv[2] || "public/sitemap-ci.xml");
const buildDate = (process.env.SITEMAP_BUILD_DATE || new Date().toISOString()).slice(0, 10);

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const manifest = getSitemapManifest();
const urls = manifest.map((item) => {
  const path = item.path.startsWith("/") ? item.path : `/${item.path}`;
  const location = `${siteUrl}${path}`;
  const lastModified = item.updatedAt
    ? item.updatedAt.toISOString().slice(0, 10)
    : buildDate;

  return [
    "  <url>",
    `    <loc>${escapeXml(location)}</loc>`,
    `    <lastmod>${lastModified}</lastmod>`,
    `    <changefreq>${item.changeFrequency}</changefreq>`,
    `    <priority>${item.priority.toFixed(2)}</priority>`,
    "  </url>",
  ].join("\n");
});

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  "</urlset>",
  "",
].join("\n");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, xml, "utf8");
console.log(`CI_SITEMAP_GENERATED=${outputPath}`);
console.log(`CI_SITEMAP_ENTRIES=${urls.length}`);
