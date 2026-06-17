import { siteUrl } from "@/config/site";

/** Canonical public origin — single source of truth via `src/config/site.ts`. */
export const SITE_URL = siteUrl;

export function absoluteUrl(path: string): string {
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${safePath}`;
}

export function absoluteImageUrl(path: string): string {
  return absoluteUrl(path);
}

export function absoluteLocalizedUrl(locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return absoluteUrl(`/${locale}`);
  }
  return absoluteUrl(`/${locale}${normalized}`);
}
