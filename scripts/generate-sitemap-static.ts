/**
 * Build-time locale sitemap shards + index — served from public/sitemap/ on CDN.
 * Both index and shards are static files to avoid SSR/ISR overhead on Cloud Run.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { SITE_BASE_URL } from "@/lib/seo/global-seo-config";
import {
  generateSitemapIndexXml,
  generateSitemapUrlsetXml,
} from "@/lib/seo/generate-sitemap-xml";
import { buildLocaleSitemapUrlRecords } from "@/lib/seo/locale-sitemap";

async function main(): Promise<void> {
  const outDir = join(process.cwd(), "public", "sitemap");
  mkdirSync(outDir, { recursive: true });

  let totalUrls = 0;
  const shardLastMods = new Date();

  for (const locale of SUPPORTED_LOCALES) {
    const records = await buildLocaleSitemapUrlRecords(locale);
    const xml = generateSitemapUrlsetXml(records);
    const filePath = join(outDir, `${locale}.xml`);
    writeFileSync(filePath, xml, "utf8");
    totalUrls += records.length;
    console.log(
      `  ${locale}.xml — ${records.length} URLs, ${(Buffer.byteLength(xml, "utf8") / 1024).toFixed(1)} KB`,
    );
  }

  // Generate sitemap index at public/sitemap.xml using build timestamp
  // to avoid re-running expensive getLocaleSitemapShardLastModified for each shard.
  const base = SITE_BASE_URL.replace(/\/$/, "");
  const indexEntries = SUPPORTED_LOCALES.map((locale) => ({
    url: `${base}/sitemap/${locale}.xml`,
    lastModified: shardLastMods,
  }));
  const indexXml = generateSitemapIndexXml(indexEntries);
  const indexPath = join(process.cwd(), "public", "sitemap.xml");
  writeFileSync(indexPath, indexXml, "utf8");
  console.log(
    `  sitemap.xml — ${indexEntries.length} entries, ${(Buffer.byteLength(indexXml, "utf8") / 1024).toFixed(1)} KB`,
  );

  console.log(
    `generate:sitemap-static — base=${SITE_BASE_URL} shards=${SUPPORTED_LOCALES.length} totalUrls=${totalUrls}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
