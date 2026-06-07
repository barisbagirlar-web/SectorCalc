# SectorCalc Week-1 Optimization Loop

Controlled optimization cycle for the first 7 days after launch. Measure first, fix only measured friction or blockers.

**Related docs:**
- [Week-1 Priority URL Matrix](./week-1-priority-url-matrix.md)
- [Week-1 Fix Rules](./week-1-fix-rules.md)
- [Week-1 Report Template](./week-1-report-template.md)
- [Conversion Event QA](./conversion-event-qa.md)
- [Search Console & IndexNow Runbook](./search-console-indexnow-runbook.md)
- [GSC URL Inspection Checklist](./gsc-url-inspection-checklist.md)
- [Conversion Review Playbook](./conversion-review-playbook.md)

---

## 1. Daily checklist

Run once per day (15–20 min). Log findings in the [Week-1 Report Template](./week-1-report-template.md).

| Check | Where | Pass criteria |
|---|---|---|
| GSC page indexing | Search Console → Pages | No new critical URLs stuck in “Discovered – not indexed” |
| Sitemap submitted/processed | GSC → Sitemaps | Status Success; URL count ≈ expected (~340 EN+TR) |
| Critical URL inspection status | GSC URL Inspection | Tier-1 URLs from [priority matrix](./week-1-priority-url-matrix.md) indexed or requested |
| Top landing pages | Analytics / GSC Performance | Note top 5 entry URLs and bounce pattern |
| Top free tool opens | `free_tool_open` events | Compare opens vs prior day |
| Calculate events | `free_tool_calculate` | Open→calculate rate stable or improving |
| `free_to_premium_click` | Conversion events | Calculate→premium CTA rate |
| `premium_unlock_click` | Conversion events | Preview→unlock rate |
| `pricing_cta_click` | Conversion events | Pricing view→CTA rate |
| `beta_partner_submit` | Conversion events | Form completion count |
| Mobile usability | GSC → Experience + spot check 390px | No horizontal scroll on Tier-1 URLs |
| Console/network error spot check | DevTools on 3 Tier-1 pages | No blocking JS errors |

**Daily rule:** No copy or layout changes unless a checklist item shows a clear drop-off or blocker. See [fix rules](./week-1-fix-rules.md).

---

## 2. Search Console checks

Use [gsc-url-inspection-checklist.md](./gsc-url-inspection-checklist.md).

**Week-1 focus:**
1. Confirm sitemap URL matches live host (`SITE_BASE_URL/sitemap.xml` from `global-seo-config.ts`).
2. Request indexing for any Tier-1 URL not indexed after 72h.
3. Review **Pages** report for:
   - “Discovered – currently not indexed” on Tier-1 or Tier-2 URLs
   - Soft 404 or redirect errors
   - Canonical mismatch warnings
4. Compare indexed count vs sitemap manifest (~170 locale-less paths × 2 locales).

**Do not:** Submit print, admin, or API routes. Sitemap manifest excludes these automatically.

---

## 3. IndexNow checks

Use [indexnow-setup.md](./indexnow-setup.md) and [search-console-indexnow-runbook.md](./search-console-indexnow-runbook.md).

**Week-1 cadence:**
- **Day 1:** Run `npm run seo:indexnow` after deploy; confirm manifest export in prebuild.
- **Day 3:** Re-submit if >20 new or updated URLs shipped.
- **Day 7:** Full manifest re-submit before weekly report.

**Verify:**
- `scripts/.cache/indexable-urls.json` matches `getIndexableUrlManifest()` count
- IndexNow key file reachable at `/{key}.txt` on live host
- No admin/api/print URLs in manifest

---

## 4. Conversion funnel checks

| Stage | Event(s) | Healthy signal (Week-1 baseline) |
|---|---|---|
| Landing | `seo_landing_cta_click`, `homepage_cta_click` | Clicks on SEO hubs and home CTAs |
| Tool open | `free_tool_open` | Opens on Tier-1 free tools |
| Calculation | `free_tool_calculate` | >40% of opens on utility tools (varies by tool) |
| Premium interest | `free_to_premium_click` | Any clicks from high-traffic free tools |
| Premium preview | `premium_analyzer_open`, `premium_calculate` | Opens on Tier-1 premium analyzers |
| Unlock intent | `premium_unlock_click` | Clicks from locked report state |
| Pricing intent | `pricing_view`, `pricing_cta_click` | Pricing page views with CTA clicks |
| Lead | `beta_partner_submit` | At least test submissions if campaign active |
| Export | `report_export_click`, `report_print_click`, etc. | Entitled export only |

Full event reference: [conversion-event-qa.md](./conversion-event-qa.md).

---

## 5. Page priority matrix

See [week-1-priority-url-matrix.md](./week-1-priority-url-matrix.md).

**Week-1 allocation:**
- **70%** of inspection and fix time → Tier 1
- **25%** → Tier 2
- **5%** → Tier 3 spot checks only

---

## 6. Fix decision rules

See [week-1-fix-rules.md](./week-1-fix-rules.md).

**Golden rule:** Data before diff. If Week-1 data is insufficient, document the gap in the weekly report — do not ship speculative refactors.

---

## 7. Micro-copy improvement rules

Allowed without product sign-off (CTA friction only):

| Surface | Principle | Example |
|---|---|---|
| Free → premium CTA | Name the gap, not the product | “See what this estimate misses” |
| Premium locked CTA | Emphasize full decision output | “Unlock full decision report” |
| Pricing Pro CTA | Clarify access type | “Start Pro report access” |
| Helper under CTA | One line: hidden drivers + export | “Unlock hidden drivers, thresholds and export-ready decision output.” |

**Not allowed in Week-1:** Homepage rewrite, pricing changes, new calculators, formula changes.

---

## 8. Internal-link improvement rules

Max **3 contextual links** per free tool page (no link spam):

1. **Related guide** — authority guide when mapped (`FreeToolAuthorityBlock`)
2. **Related premium** — upsell CTA after calculate (when `relatedPremiumSlug` exists)
3. **Related hub** — SEO hub or category via authority block

**When to add links (GSC “Discovered – not indexed”):**
- Add 2–3 internal links from Tier-1 or Tier-2 pages to the affected URL
- Prefer contextual anchor text over generic “click here”

**Sources of truth for link targets:**
- `getAuthorityGuideForFreeTool()` — guide mapping
- `getSeoHubSlugForGuide()` — SEO hub
- `listRelatedTrafficTools()` — related free tools

---

## 9. Report template

Fill [week-1-report-template.md](./week-1-report-template.md) every **Day 7** (or end of Week-1 window).

---

## Week-1 cadence summary

| Day | Focus |
|---|---|
| 1 | Deploy verify, sitemap + IndexNow submit, Tier-1 inspection |
| 2 | GSC indexing status, funnel baseline snapshot |
| 3 | Free tool open/calculate review, micro-copy if friction measured |
| 4 | Premium preview/unlock review |
| 5 | Pricing CTA review, mobile QA on Tier-1 |
| 6 | Tier-2 expansion checks, internal links for not-indexed URLs |
| 7 | Complete weekly report, prioritize Week-2 backlog |
