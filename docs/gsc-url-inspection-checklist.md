# SectorCalc Google Search Console URL Inspection Checklist

Operational checklist for first indexing after deploy. Use with [search-console-indexnow-runbook.md](./search-console-indexnow-runbook.md).

**Live host (Firebase):** `https://sectorcalc-bf412.web.app`  
**Production domain (when configured):** `https://sectorcalc.com`  
**Sitemap:** `https://sectorcalc-bf412.web.app/sitemap.xml`

---

## 1. Submit sitemap

- [ ] Open [Google Search Console](https://search.google.com/search-console) → property for live host
- [ ] Sitemaps → Add new sitemap → `sitemap.xml`
- [ ] Confirm status: Success (may take hours)
- [ ] Note discovered URL count vs expected (sitemap includes all configured locales)

---

## 2. Inspect critical URLs

For each URL below, run **URL Inspection** → **Test Live URL** → **Request Indexing** (if eligible).

| # | Path | Notes |
|---|------|-------|
| 1 | `/en` | Homepage |
| 2 | `/en/free-tools` | Free hub |
| 3 | `/en/premium-tools` | Premium hub |
| 4 | `/en/categories` | Category hub |
| 5 | `/en/industries` | Industry hub |
| 6 | `/en/pricing` | Pricing |
| 7 | `/en/seo/manufacturing-cost-calculators` | SEO landing |
| 8 | `/en/guides/what-is-oee-and-how-to-calculate-it` | Authority guide |
| 9 | `/en/tools/free/area-converter` | Conversion tool |
| 10 | `/en/tools/free/oee-calculator` | Manufacturing free tool |
| 11 | `/en/tools/free/concrete-volume-calculator` | Construction free tool |
| 12 | `/en/tools/premium-schema/cnc-oee-loss` | Premium analyzer |
| 13 | `/en/tools/premium-schema/carbon-footprint-compliance-risk` | Premium analyzer |

**Per-URL checks:**
- [ ] URL Inspection completed
- [ ] Test Live URL — HTTP 200
- [ ] Request Indexing submitted
- [ ] Canonical points to inspected URL (no unexpected redirect chain)
- [ ] Mobile usability — no horizontal scroll at 390px
- [ ] Re-check indexed status after 24–72h

Full ordered list: `getIndexableUrlManifest()` in `src/lib/seo/indexable-url-manifest.ts` (sorted by `inspectionOrder`).

---

## 3. Inspect high-value free tools

Spot-check beyond critical list (request indexing if new or updated):

- `/en/tools/free/scrap-rate-calculator`
- `/en/tools/free/route-cost-calculator`
- `/en/tools/free/food-cost-calculator`
- `/en/tools/free/kwh-cost-calculator`
- `/en/tools/free/break-even-calculator`
- `/en/tools/free/mortgage-calculator`

---

## 4. Inspect premium analyzer URLs

Spot-check premium schema pages (no `/print` routes):

- `/en/tools/premium-schema/construction-project-overrun`
- `/en/tools/premium-schema/logistics-route-loss`
- `/en/tools/premium-schema/energy-peak-cost`
- `/en/tools/premium-schema/restaurant-menu-margin-leak`

Confirm: `robots` disallows print routes; page has no accidental `noindex`.

---

## 5. Inspect SEO landing pages

All 8 programmatic SEO hubs (`/en/seo/…`):

- [ ] `manufacturing-cost-calculators`
- [ ] `construction-cost-calculators`
- [ ] `logistics-route-calculators`
- [ ] `energy-carbon-calculators`
- [ ] `agriculture-calculators`
- [ ] `finance-business-calculators`
- [ ] `unit-conversion-calculators`
- [ ] `hidden-loss-decision-reports`

---

## 6. Inspect authority guides

All 8 guides (`/en/guides/…`):

- [ ] `how-to-calculate-manufacturing-cost`
- [ ] `what-is-oee-and-how-to-calculate-it`
- [ ] `how-to-calculate-scrap-rate`
- [ ] `how-to-calculate-construction-cost-overrun`
- [ ] `how-to-calculate-route-cost`
- [ ] `how-to-calculate-restaurant-food-cost`
- [ ] `how-to-calculate-energy-cost-and-carbon-exposure`
- [ ] `how-to-use-area-converter`

---

## 7. Rich Results Test URLs

Test in [Rich Results Test](https://search.google.com/test/rich-results):

- `/en` — Organization, WebSite, SoftwareApplication
- `/en/tools/free/oee-calculator` — Breadcrumb, WebApplication, FAQPage
- `/en/tools/premium-schema/cnc-oee-loss` — Breadcrumb, SoftwareApplication, FAQPage
- `/en/seo/manufacturing-cost-calculators` — Breadcrumb, ItemList, FAQPage
- `/en/guides/what-is-oee-and-how-to-calculate-it` — Article, FAQPage, Breadcrumb

No fake ratings, reviews or misleading offers in JSON-LD.

---

## 8. Mobile Usability Check

- [ ] `/en` — LCP, no horizontal scroll
- [ ] `/en/free-tools` — tap targets, header not clipped
- [ ] `/en/tools/free/area-converter` — form + result usable at 390px
- [ ] `/en/pricing` — plan cards stack correctly

---

## 9. Page Indexing Notes

**Should be indexed:** public hubs, free tools, premium analyzers (not print), SEO hubs, guides, industries, pricing.

**Should NOT be indexed:**
- `/admin/*`
- `/api/*`
- `/*/tools/premium-schema/*/print`
- Checkout / account-only flows if marked noindex

**Coverage report review:**
- [ ] Confirm print URLs excluded or “Excluded by robots”
- [ ] Investigate “Crawled — currently not indexed” for priority URLs
- [ ] Investigate “Discovered — currently not indexed” after week 1

---

## 10. Week-1 Review

- [ ] Sitemap processed without errors
- [ ] At least 5 critical URLs show “URL is on Google” or valid indexing progress
- [ ] Top queries appearing in Performance report (may be minimal in week 1)
- [ ] No mobile usability errors on core templates
- [ ] Internal links: hubs → tools → pricing paths crawlable in HTML
- [ ] IndexNow submitted if key configured ([indexnow-setup.md](./indexnow-setup.md))
- [ ] Update [conversion-review-playbook.md](./conversion-review-playbook.md) with landing traffic baseline

---

## Turkish locale spot checks

- [ ] `/tr/free-tools`
- [ ] `/tr/premium-tools`
- [ ] `/tr/seo/manufacturing-cost-calculators`
- [ ] `/tr/guides/what-is-oee-and-how-to-calculate-it`

---

## Authority TXT files (non-HTML discovery)

- [ ] `/llms.txt`
- [ ] `/sectorcalc-index.txt`
- [ ] `/services-products.txt`
- [ ] `/faq-knowledge.txt`

See [seo-public-file-checklist.md](./seo-public-file-checklist.md).
