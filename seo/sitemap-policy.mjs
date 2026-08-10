import { readFileSync } from 'node:fs';

const configUrl = new URL('../sites/sectorcalc/seo.config.json', import.meta.url);
const config = JSON.parse(readFileSync(configUrl, 'utf8'));
const thresholds = config?.thresholds ?? {};

function requireInteger(name, min, max) {
  const value = thresholds[name];
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`INVALID_SITEMAP_POLICY ${name}=${String(value)}`);
  }
  return value;
}

export const SITEMAP_POLICY = Object.freeze({
  maxShrinkPct: requireInteger('sitemapMaxShrinkPct', 1, 50),
  maxUrls: requireInteger('sitemapMaxUrlsPerFile', 1, 50000),
  maxBytes: requireInteger('sitemapMaxBytesPerFile', 1, 52428800),
  cacheMaxAgeSeconds: requireInteger('sitemapCacheMaxAgeSeconds', 60, 86400),
});

export const SITEMAP_RETAINED_FRACTION = (100 - SITEMAP_POLICY.maxShrinkPct) / 100;
