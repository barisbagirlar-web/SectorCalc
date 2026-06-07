import sectorConfig from "@/lib/os/registry/sector-registry.config.json";
import { siteUrl } from "@/config/site";
import { pingIndexNow } from "@/lib/seo/indexNow";

const LOCALES = ["en", "tr", "es", "de", "ar"] as const;

const SEO_HUB_ROUTES = ["/os", "/audit", "/benchmarks", "/sustainability"] as const;

/** Build absolute URLs for all sector audit pages + SEO hubs (all locales). */
export function buildIndustrialRegistryIndexUrls(): string[] {
  const base = siteUrl.replace(/\/$/, "");
  const sectorKeys = Object.keys(sectorConfig.sectors);
  const urls = new Set<string>();

  for (const locale of LOCALES) {
    for (const hub of SEO_HUB_ROUTES) {
      urls.add(`${base}/${locale}${hub}`);
    }

    for (const sectorKey of sectorKeys) {
      urls.add(`${base}/${locale}/audit/${sectorKey}`);
    }
  }

  return [...urls];
}

/** Notify search engines when IndustrialRegistry / sector pages change. */
export async function pingIndustrialRegistryIndexNow(): Promise<{
  ok: boolean;
  urlCount: number;
  status?: number;
}> {
  const urlList = buildIndustrialRegistryIndexUrls();
  const result = await pingIndexNow(urlList);

  return {
    ok: result.ok,
    urlCount: urlList.length,
    status: result.status,
  };
}
