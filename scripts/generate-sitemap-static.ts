/**
 * Build-time locale sitemap shards — served from public/sitemap/*.xml on CDN.
 * Index (sitemap.xml) is served via SSR/ISR for dynamic freshness.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { SITE_BASE_URL } from "@/lib/seo/global-seo-config";
import { generateSitemapUrlsetXml } from "@/lib/seo/generate-sitemap-xml";
import { buildLocaleSitemapUrlRecords } from "@/lib/seo/locale-sitemap";

async function main(): Promise<void> {
  const outDir = join(process.cwd(), "public", "sitemap");
  mkdirSync(outDir, { recursive: true });

  let totalUrls = 0;

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

  console.log(
    `generate:sitemap-static — base=${SITE_BASE_URL} shards=${SUPPORTED_LOCALES.length} totalUrls=${totalUrls}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
