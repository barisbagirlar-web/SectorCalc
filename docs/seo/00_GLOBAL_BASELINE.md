# SectorCalc global live baseline — 2026-08-17

Captured **before** mandate code changes. Source: `https://sectorcalc.com` HTTP GET (Python urllib, follow redirects, max 5 hops).

Do not treat this file as a live sitemap. It is a frozen production snapshot.

## Capture method

```text
GET https://sectorcalc.com{path}
User-Agent: SectorCalcBaseline/1.0
```

Raw headers/bodies: `docs/seo/00_LIVE_HTTP_CAPTURE.json` plus `/tmp/sectorcalc-live-baseline/`.

## Live HTTP (final URL after follow)

| Path | Status | Final URL | Bytes | Notes |
|---|---:|---|---:|---|
| /robots.txt | 200 | /robots.txt | 4349 | GPTBot/ClaudeBot/Google-Extended **Allow** — contradicts local `seo/crawler-policy.mjs` |
| /sitemap.xml | 200 | /sitemap.xml | 11634 | Single urlset, 90 locs, lastmod present, no priority/changefreq |
| /sitemap-images.xml | 200 | /sitemap-images.xml | 15342 | |
| /llm.txt | 200 | /llm.txt | 33819 | Byte twin of llms.txt |
| /llms.txt | 200 | /llms.txt | 33819 | Contains SEO bait, Cloud Scheduler, `/api/billing/health`, CSS hashes, `/src/` paths |
| /llms-full.txt | 200 | /llms-full.txt | 17619 | |
| /guides | 200 | /guides | 28266 | Self-canonical, index,follow. H1 is **not** the mandate H1 |
| /guides/ | 200 | /guides | 28266 | Trailing slash collapsed |
| /tools | 200 | /tools.html | 66879 | Pretty URL is **not** canonical |
| /tools.html | 200 | /tools.html | 66879 | Canonical public tools URL |
| /pro.html | 200 | /pro.html | 39996 | Duplicate paid catalog; in sitemap |
| /pricing | 200 | /pricing.html | 33982 | |
| /pricing.html | 200 | /pricing.html | 33982 | H1: “Commission decision stock…” |
| /account | 200 | /account.html | 25863 | File is noindex |
| /account.html | 200 | /account.html | 25863 | |
| /glossary | 200 | /glossary | 41031 | Operator jargon in H1/FAQ |
| /topics | 200 | /topics | 17832 | |
| /compare | 200 | /compare | 22071 | |
| /status | 200 | /status | 7488 | Claims “All systems operational” with stale 2026-07-28 stamp |
| /about | 200 | /about | 7672 | |
| /security | 200 | /security | 6509 | |
| /ai-robots.txt | 200 | /ai-robots.txt | 802 | |
| /trust | 404 | /trust | 4865 | Missing trust hub |
| /case-studies | 200 | /case-studies | 36505 | |
| /de | 200 | /de | 2186 | Unpublished locale preview |
| /ja | 200 | /ja | 2156 | Unpublished locale preview |
| /zh | 200 | /zh | 2042 | Unpublished locale preview |

## Navigation (from live /guides)

```text
/tools.html
/glossary
/guides
/compare
/pricing.html
/account.html
/login.html
```

Broken navigation 404 count on those hrefs: **0** (`/guides` is 200).

## Guides hub (live)

- title: Exclusive Engineering Guides | SectorCalc
- canonical: https://sectorcalc.com/guides
- robots: index,follow
- html lang: en
- H1: Engineering guides at money-page depth
- Visible operator phrase `query fan-out`: **present**
- Visible `SEO bait`: absent on hub HTML (present in llms.txt)

## Sitemap inventory (live)

- Root type: urlset (not sitemapindex)
- URL count: 90
- Includes `/pro.html`, `/tools.html`, `/pricing.html`
- Does not include `/trust`
- lastmod: yes
- priority/changefreq: no

## Robots / crawlers (live)

| Bot | Live policy |
|---|---|
| Googlebot | Allow / + private Disallow |
| Bingbot | Allow / + private Disallow |
| OAI-SearchBot | Allow / + private Disallow |
| Claude-SearchBot | Allow / + private Disallow |
| PerplexityBot | Allow / + private Disallow |
| GPTBot | **Allow /** (mandate: Disallow) |
| ClaudeBot | **Allow /** (mandate: Disallow) |
| Google-Extended | **Allow /** (mandate: Disallow) |

Local committed `seo/crawler-policy.mjs` already marks GPTBot/ClaudeBot/Google-Extended as training/block. `public/robots.txt` on `origin/main` still Allows them. Fail-closed drift.

## Counts to compare after change

```text
total public routes sampled: 27
indexable (this sample, excluding noindex locales/account): not fully enumerated
noindex locales live: /de /ja /zh (200)
redirects in this sample: /tools /pricing /account internally resolve to .html
gone: none sampled (legacy 404s exist historically)
broken navigation before: 0 on primary nav
```

## Defects this mandate must close

1. Mixed canonical architecture (`/tools.html` owns `/tools`).
2. `/pro.html` remains a second paid catalog and sitemap URL.
3. Public operator jargon in guides, glossary, llms.
4. robots.txt training-crawler policy silently inverted vs SSOT.
5. Locale preview pages still public 200.
6. llms.txt is an operations dump, not a 20–50 resource map.
7. `/trust` 404.
8. Status page claims live ops with a stale manual timestamp.
9. No `seo:full-audit` / `ai:full-audit` umbrella commands.
