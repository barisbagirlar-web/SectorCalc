import type { Metadata } from "next";
import { BRAND_ASSETS } from "@/config/brand";
import { SITE } from "@/config/site";
import { locales, type AppLocale } from "@/i18n/routing";

const SITE_ICONS: Metadata["icons"] = {
  icon: [
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
  /** Path without locale prefix, e.g. `/audit/cnc` */
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
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}

function buildHreflangAlternates(path: string): Metadata["alternates"] {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[locale] = `${SITE.url}${buildLocalizedPath(normalized, locale)}`;
  }

  languages["x-default"] = `${SITE.url}${buildLocalizedPath(normalized, "en")}`;

  return { languages };
}

export function getToolMetadata(options: ToolMetadataOptions): Metadata {
  const tierLabel = options.tier === "free" ? "Free" : "Premium";
  const title = `${options.toolTitle} — ${tierLabel}`;
  const description = `${tierLabel} ${options.toolTitle.toLowerCase()} for ${options.sectorName.toLowerCase()}. Calculate costs, detect losses, and get expert-level decision reports.`;
  const path = `/tools/${options.tier}/${options.toolSlug}`;
  const locale = (options.locale ?? "en") as AppLocale;

  return createPageMetadata({
    title,
    description,
    path,
    locale,
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
  const hreflang = buildHreflangAlternates(path);

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),
    icons: SITE_ICONS,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.siteName,
      locale: locale === "en" ? "en_US" : `${locale}_${locale.toUpperCase()}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
      ...hreflang,
    },
  };
}
