import type { Metadata } from "next";
import { BRAND_ASSETS } from "@/config/brand";
import { SITE } from "@/config/site";

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
  path?: string;
}

export interface ToolMetadataOptions {
  toolSlug: string;
  toolTitle: string;
  sectorName: string;
  tier: "free" | "premium";
  locale?: string;
}

export function getToolMetadata(options: ToolMetadataOptions): Metadata {
  const tierLabel = options.tier === "free" ? "Free" : "Premium";
  const title = `${options.toolTitle} — ${tierLabel}`;
  const description = `${tierLabel} ${options.toolTitle.toLowerCase()} for ${options.sectorName.toLowerCase()}. Calculate costs, detect losses, and get expert-level decision reports.`;
  const path =
    options.locale !== undefined
      ? `/${options.locale}/tools/${options.tier}/${options.toolSlug}`
      : `/tools/${options.tier}/${options.toolSlug}`;

  return createPageMetadata({
    title,
    description,
    path,
  });
}

export function createPageMetadata(options: PageMetadataOptions = {}): Metadata {
  const title = options.title
    ? `${options.title} | ${SITE.siteName}`
    : SITE.defaultTitle;
  const description = options.description ?? SITE.defaultDescription;
  const url = options.path ? `${SITE.url}${options.path}` : SITE.url;

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
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
