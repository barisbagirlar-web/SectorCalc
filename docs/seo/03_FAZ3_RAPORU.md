# SectorCalc SEO V3 — Phase 3 Report

## Crawl/index state

A V3 state adapter now maps records to DRAFT, PUBLISHED_INDEXABLE, PUBLISHED_NOINDEX, REDIRECTED or GONE while preserving the existing registry/indexability SSOT.

## Sitemap engine

- Input: registry-owned indexable + sitemap-eligible routes only.
- Sitemap order is deterministic by canonical URL.
- Canonical query/fragment URLs and duplicates fail closed.
- Googlebot-disallowed routes fail closed before sitemap write.
- Homepage is mandatory.
- Empty output fails closed.
- A drop below 80% of the declared indexable baseline fails closed (stronger than the old 50% guard).
- Chunking rolls over below protocol ceilings at 45,000 URLs / 47 MB; reaching the limit is not an exception.
- `priority` and `changefreq` are never emitted.
- URL `lastmod` is emitted only from a reliable record-level significant-change timestamp. SectorCalc registry records do not currently carry reliable timestamps, so the generator correctly omits `lastmod` rather than using build/deploy time.
- If chunking is ever required, an index is generated; child index `lastmod` remains omitted until a live-baseline hash finalizer can prove NEW/CHANGED state.

## Soft-404 guard

`scripts/seo/soft404-v3.ts` detects obvious not-found/no-results copy and extremely thin indexable HTML without auto-redirecting deleted URLs to home.

## Google-current validation

Google documents that canonical URLs should be used in sitemaps, single files are limited to 50,000 URLs / 50 MB, accurate `lastmod` may be used, and `priority` / `changefreq` are ignored. Google sitemap ping is deprecated; no ping endpoint is implemented.
