import sectorConfig from "@/lib/os/registry/sector-registry.config.json";
import { siteUrl } from "@/config/site";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-routing";
import { buildLocalizedUrl } from "@/lib/infrastructure/seo/sitemap-manifest";
import { pingIndexNow } from "@/lib/infrastructure/seo/indexNow";

const SEO_HUB_ROUTES = ["/os", "/audit", "/benchmarks", "/sustainability"] as const;

/** Build absolute URLs for all sector audit pages + SEO hubs (all locales). */
export function buildIndustrialRegistryIndexUrls(): string[] {
  const base = siteUrl.replace(/\/$/, "");
  const sectorKeys = Object.keys(sectorConfig.sectors);
  const urls = new Set<string>();

  for (const locale of SUPPORTED_LOCALES) {
    for (const hub of SEO_HUB_ROUTES) {
      urls.add(buildLocalizedUrl(hub, locale, base));
    }

    for (const sectorKey of sectorKeys) {
      urls.add(buildLocalizedUrl(`/audit/${sectorKey}`, locale, base));
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
