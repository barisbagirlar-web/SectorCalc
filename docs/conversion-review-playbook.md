# Conversion Review Playbook

Weekly review guide for SectorCalc conversion analytics after traffic campaigns go live.

## Metrics to review (weekly)

1. **Top landing pages** — `homepage_cta_click`, `seo_landing_cta_click` by pagePath
2. **Free tool opens** — `free_tool_open` (stage: `tool_open`)
3. **Free tool calculations** — `free_tool_calculate` (stage: `calculation`)
4. **Free → premium click rate** — `free_to_premium_click` ÷ `free_tool_calculate`
5. **Premium preview opens** — `premium_analyzer_open`
6. **Premium calculations** — `premium_calculate`
7. **Unlock intent** — `premium_unlock_click`, `locked_export_click`
8. **Pricing CTA clicks** — `pricing_cta_click`, `view_pricing_from_locked_report`
9. **Pricing views** — `pricing_view`
10. **Beta partner submits** — `beta_partner_submit` (stage: `lead_submit`)
11. **Export clicks** — `report_print_click`, `report_csv_click`, `report_copy_summary_click`
12. **Top campaign clusters** — group by `campaignId` (utm_campaign)

## Funnel stages

| Stage | Meaning |
|---|---|
| `landing` | Hub/home CTA or beta page open |
| `tool_open` | Free calculator page viewed |
| `calculation` | Free calculator submitted successfully |
| `premium_interest` | Free → premium CTA click |
| `premium_preview` | Premium analyzer open or calculate |
| `unlock_intent` | Unlock report / locked export click |
| `pricing_intent` | Pricing view or pricing CTA |
| `lead_submit` | Beta partner form submitted |
| `export_intent` | Entitled export action |

## Decision rules

| Signal | Likely issue | Action |
|---|---|---|
| High opens, low calculations | Form UX or validation friction | Review mobile inputs, error messages, required fields |
| Calculations OK, no premium clicks | CTA/value proposition weak | Strengthen premium upsell copy, move CTA above fold |
| Premium preview OK, no unlock | Report value unclear | Improve locked preview, sample report links, threshold visibility |
| Pricing views OK, no CTA clicks | Plan/packaging mismatch | Review Pro vs single-report positioning (do not change prices without product sign-off) |
| Beta opens OK, no submits | Form too long or trust gap | Shorten form, add privacy note, reduce required fields |
| Campaign traffic, no calculations | Wrong audience or landing mismatch | Adjust cluster targeting or landing content |

## Privacy boundaries

- Events contain: locale, pagePath, toolSlug, premiumSlug, campaignId, ctaId, stage, exportType
- Events never contain: email, name, company, phone, input values, result values, financial amounts
- Beta partner PII stays in Firestore lead records only — not in analytics payloads

## Data source notes

- V1 uses `trackConversionEvent()` → `trackSectorCalcEvent()` adapter (no-op in production until GA4/PostHog wired)
- Dev mode: `console.debug` for conversion events
- No Firestore event collection in v1 — use browser devtools or future analytics dashboard

## Review cadence

- **Weekly:** funnel drop-offs, top 5 pages, campaign comparison
- **Monthly:** CTA copy experiments, hub content updates, beta lead quality review
