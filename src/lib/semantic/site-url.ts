export const SITE_URL = "https://www.sectorcalc.com";

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
