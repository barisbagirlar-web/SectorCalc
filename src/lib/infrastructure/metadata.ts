type AppLocale = "en";
import type { Metadata } from "next";
import { BRAND_ASSETS } from "@/config/brand";
import { SITE } from "@/config/site";
import { getCanonicalPathForLocale } from "@/lib/infrastructure/i18n/locale-routing";
import { normalizeLocale } from "@/lib/core/format/localization";
import {
  resolveToolMetadataDescription,
  resolveToolTierLabel,
} from "@/lib/infrastructure/metadata/tool-metadata-copy";
import { metadataRobots } from "@/lib/infrastructure/seo/seo-indexing-control";

const SITE_ICONS: Metadata["icons"] = {
  icon: [
    { url: BRAND_ASSETS.favicon.svg, sizes: "any", type: "image/svg+xml" },
    { url: BRAND_ASSETS.favicon.size32, sizes: "32x32", type: "image/png" },
    { url: BRAND_ASSETS.favicon.master, sizes: "512x512", type: "image/png" },
  ],
  apple: [
    {
      url: BRAND_ASSETS.favicon.appleTouch,
      sizes: "180x180",
      type: "image/png",
    },
  ],
  shortcut: BRAND_ASSETS.favicon.master,
};

export interface PageMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  locale?: AppLocale;
}

export interface ToolMetadataOptions {
  toolSlug: string;
  toolTitle: string;
  sectorName: string;
  tier: "free" | "premium";
  locale?: string;
}

function buildLocalizedPath(path: string, locale: AppLocale): string {
  return getCanonicalPathForLocale(path, locale);
}

function buildHreflangAlternates(path: string): Metadata["alternates"] {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const languages: Record<string, string> = {};

  for (const locale of ['en']) {
    languages[locale] = `${SITE.url}${buildLocalizedPath(normalized, locale as AppLocale)}`;
  }

  languages["x-default"] = `${SITE.url}${buildLocalizedPath(normalized, "en" as AppLocale)}`;

  return { languages };
}

export function getToolMetadata(options: ToolMetadataOptions): Metadata {
  const locale = normalizeLocale(options.locale ?? "en") as AppLocale;
  const tierLabel = resolveToolTierLabel(locale, options.tier);
  const title = `${options.toolTitle} — ${tierLabel}`;
  const description = resolveToolMetadataDescription(
    locale,
    options.tier,
    options.toolTitle,
    options.sectorName,
  );
  const path = `/tools/${options.tier}/${options.toolSlug}`;

  return createPageMetadata({
    title,
    description,
    path,
    locale: locale,
  });
}

function finalizePageTitle(rawTitle: string): string {
  const trimmed = rawTitle.trim();
  const suffix = ` | ${SITE.siteName}`;
  if (trimmed.endsWith(suffix)) {
    return trimmed;
  }
  return `${trimmed}${suffix}`;
}

export function createPageMetadata(options: PageMetadataOptions = {}): Metadata {
  const title = options.title ? finalizePageTitle(options.title) : SITE.defaultTitle;
  const description = options.description ?? SITE.defaultDescription;
  const path = options.path ?? "/";
  const locale = options.locale ?? "en";
  const url = `${SITE.url}${buildLocalizedPath(path, locale)}`;
  const h_reflang = buildHreflangAlternates(path);

  // Canonical is always English (without locale prefix)
  const canonicalUrl = `${SITE.url}${path === "/" ? "" : path}`;

  const isEnglish = locale === "en";
  const robots = isEnglish
    ? metadataRobots()
    : {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      };

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),
    icons: SITE_ICONS,
    robots,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.siteName,
      locale: locale === "en" ? "en_US" : `${locale}_${String(locale).toUpperCase()}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
      ...h_reflang,
    },
    verification: {
      google: "YC4-K4Q1XVrErVW2UE9eNe4Tni2hhFFmBhF8dZjcVoY",
      other: {
        "msvalidate.01": "C97289CA0F699D6B9053113A5E8FAD2A",
      },
    },
  };
}
