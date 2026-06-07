# Week-1 Priority URL Matrix

URL prioritization for indexing, QA, and conversion review during the first 7 days post-launch.

**Base URL:** Use live host (`https://sectorcalc-bf412.web.app` or production domain from `NEXT_PUBLIC_SITE_URL`).

**Source of truth for full URL list:** `getSitemapManifest()` in `src/lib/seo/sitemap-manifest.ts` and `getIndexableUrlManifest()` in `src/lib/seo/indexable-url-manifest.ts`.

---

## Tier 1 — Revenue / authority core

Inspect daily. Fix blockers immediately. Request GSC indexing if not indexed within 72h.

| Path | Type | Why |
|---|---|---|
| `/` | Core | Homepage, primary entry |
| `/free-tools` | Hub | Free catalog entry |
| `/premium-tools` | Hub | Premium catalog entry |
| `/pricing` | Core | Conversion endpoint |
| `/seo/manufacturing-cost-calculators` | SEO landing | Primary campaign cluster |
| `/tools/free/area-converter` | Free tool | High-intent conversion utility |
| `/tools/free/oee-calculator` | Free tool | Manufacturing authority anchor |
| `/tools/premium-schema/cnc-oee-loss` | Premium analyzer | Flagship premium report |
| `/tools/premium-schema/carbon-footprint-compliance-risk` | Premium analyzer | Cross-industry premium anchor |

**TR mirror paths:** Use `/tr` prefix for Turkish mirror paths for locale parity checks (same Tier, lower inspection priority unless TR campaign active).

---

## Tier 2 — Traffic expansion

Inspect every 2–3 days. Internal-link boost if “Discovered – not indexed”.

| Path | Type | Why |
|---|---|---|
| `/categories` | Hub | Category discovery |
| `/industries` | Hub | Industry entry |
| `/guides/what-is-oee-and-how-to-calculate-it` | Authority guide | OEE pillar content |
| `/guides/how-to-calculate-scrap-rate` | Authority guide | Manufacturing long-tail |
| `/seo/construction-cost-calculators` | SEO landing | Construction cluster |
| `/seo/logistics-cost-calculators` | SEO landing | Logistics cluster |
| `/seo/energy-carbon-calculators` | SEO landing | Energy/sustainability cluster |

**Additional Tier-2 spot checks:**
- `/tools/free/concrete-volume-calculator`
- `/tools/free/scrap-rate-calculator`
- `/tools/free/route-cost-calculator`
- `/beta-partner` (if lead campaign active)

---

## Tier 3 — Long tail

Monitor via sitemap/GSC bulk reports. Fix only on measured issues.

| Group | Count (approx.) | Notes |
|---|---|---|
| Remaining free tools | ~115 total (100 traffic + revenue overlap) | Auto in sitemap via `listAllFreeToolSlugs()` |
| Remaining premium analyzers | 27 | Auto in sitemap via `listPremiumSchemaSlugs()` |
| Remaining SEO hubs | 8 total | Programmatic SEO pages |
| Remaining authority guides | 8 total | Authority guide catalog |
| Legal / secondary hubs | privacy, terms, how-it-works, for-consultants | Lower conversion priority |

**Tier-3 action trigger:** Only when GSC shows impressions with zero clicks, or calculate→premium drop-off on a specific slug.

---

## Inspection order reference

GSC-critical paths are pre-seeded in `CRITICAL_INSPECTION_PATHS` inside `indexable-url-manifest.ts`. Tier-1 URLs above align with `inspectionOrder` 1–13.

---

## Campaign cluster mapping

| Campaign cluster | Primary landing (Tier 1–2) |
|---|---|
| manufacturing-hidden-loss | `/seo/manufacturing-cost-calculators` |
| construction-cost-overrun | `/seo/construction-cost-calculators` |
| logistics-route-cost | `/seo/logistics-cost-calculators` |
| energy-carbon-compliance | `/seo/energy-carbon-calculators` |

See `CAMPAIGN_CLUSTERS` in `src/lib/campaigns/campaign-clusters.ts`.
