# Week-1 Priority URL Matrix

URL prioritization for indexing, QA, and conversion review during the first 7 days post-launch.

**Base URL:** Use live host (`https://sectorcalc-bf412.web.app` or production domain from `NEXT_PUBLIC_SITE_URL`).

**Source of truth for full URL list:** `getSitemapManifest()` in `src/lib/seo/sitemap-manifest.ts` and `getIndexableUrlManifest()` in `src/lib/seo/indexable-url-manifest.ts`.

---

## Tier 1 — Revenue / authority core

Inspect daily. Fix blockers immediately. Request GSC indexing if not indexed within 72h.

| Path | Type | Why |
|---|---|---|
| `/en` | Core | Homepage, primary entry |
| `/en/free-tools` | Hub | Free catalog entry |
| `/en/premium-tools` | Hub | Premium catalog entry |
| `/en/pricing` | Core | Conversion endpoint |
| `/en/seo/manufacturing-cost-calculators` | SEO landing | Primary campaign cluster |
| `/en/tools/free/area-converter` | Free tool | High-intent conversion utility |
| `/en/tools/free/oee-calculator` | Free tool | Manufacturing authority anchor |
| `/en/tools/premium-schema/cnc-oee-loss` | Premium analyzer | Flagship premium report |
| `/en/tools/premium-schema/carbon-footprint-compliance-risk` | Premium analyzer | Cross-industry premium anchor |

**TR mirror paths:** Replace `/en` with `/tr` for locale parity checks (same Tier, lower inspection priority unless TR campaign active).

---

## Tier 2 — Traffic expansion

Inspect every 2–3 days. Internal-link boost if “Discovered – not indexed”.

| Path | Type | Why |
|---|---|---|
| `/en/categories` | Hub | Category discovery |
| `/en/industries` | Hub | Industry entry |
| `/en/guides/what-is-oee-and-how-to-calculate-it` | Authority guide | OEE pillar content |
| `/en/guides/how-to-calculate-scrap-rate` | Authority guide | Manufacturing long-tail |
| `/en/seo/construction-cost-calculators` | SEO landing | Construction cluster |
| `/en/seo/logistics-cost-calculators` | SEO landing | Logistics cluster |
| `/en/seo/energy-carbon-calculators` | SEO landing | Energy/sustainability cluster |

**Additional Tier-2 spot checks:**
- `/en/tools/free/concrete-volume-calculator`
- `/en/tools/free/scrap-rate-calculator`
- `/en/tools/free/route-cost-calculator`
- `/en/beta-partner` (if lead campaign active)

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
| manufacturing-hidden-loss | `/en/seo/manufacturing-cost-calculators` |
| construction-cost-overrun | `/en/seo/construction-cost-calculators` |
| logistics-route-cost | `/en/seo/logistics-cost-calculators` |
| energy-carbon-compliance | `/en/seo/energy-carbon-calculators` |

See `CAMPAIGN_CLUSTERS` in `src/lib/campaigns/campaign-clusters.ts`.
