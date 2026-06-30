/**
 * Safe no-op implementation of sitemap-static generation.
 * SectorCalc now uses dynamic sitemap.ts generation exclusively.
 */
import { SITE_BASE_URL } from "@/lib/infrastructure/seo/global-seo-config";

async function main(): Promise<void> {
  console.log(
    `generate:sitemap-static — base=${SITE_BASE_URL} shards=0 totalUrls=0 (dynamic sitemap enabled)`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
