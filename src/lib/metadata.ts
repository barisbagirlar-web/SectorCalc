import type { Metadata } from "next";
import { SITE } from "@/config/site";

export interface PageMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
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
