# SectorCalc First Traffic Campaigns

Initial campaign clusters for organic SEO, niche distribution and beta partner lead capture.

**Content pack:** See [launch-campaign-content-pack.md](./launch-campaign-content-pack.md) for LinkedIn posts, Reddit copy, outreach templates, short social posts and the full 30-day calendar.

## Campaign clusters (8)

| ID | Landing | Primary channels |
|---|---|---|
| `manufacturing-hidden-loss` | `/en/seo/manufacturing-cost-calculators` | SEO, LinkedIn, Reddit |
| `construction-cost-overrun` | `/en/seo/construction-cost-calculators` | SEO, LinkedIn, Search ads |
| `logistics-route-cost` | `/en/seo/logistics-route-calculators` | SEO, LinkedIn, WhatsApp |
| `restaurant-food-margin` | `/en/industries/restaurant` | SEO, LinkedIn, Reddit |
| `energy-carbon-exposure` | `/en/seo/energy-carbon-calculators` | SEO, LinkedIn, Email |
| `agriculture-yield-loss` | `/en/seo/agriculture-calculators` | SEO, WhatsApp, Email |
| `business-finance-calculators` | `/en/seo/finance-business-calculators` | SEO, LinkedIn, Search ads |
| `unit-conversion-traffic` | `/en/seo/unit-conversion-calculators` | SEO, Reddit, Search ads |

## Example tracked URL

```
/en/seo/manufacturing-cost-calculators?utm_source=linkedin&utm_medium=social&utm_campaign=manufacturing-hidden-loss
```

## 30-day plan

### Week 1
- Google Search Console URL inspection for all 8 landings
- Share 8 SEO hub pages in niche communities
- LinkedIn / Reddit posts per cluster pain point
- Beta partner outreach to 10 target operators

### Week 2
- Distribute 20 free calculator deep links with UTM tags
- Publish 5 premium analyzer teasers (locked preview screenshots)
- Collect first beta partner form submissions
- Review `beta_partner_submit` events and notes attribution block

### Week 3
- Compare free tool calculate vs premium unlock click rates
- Add FAQ entries based on inbound questions
- Run small search ads only if UTM propagation is verified end-to-end

### Week 4
- Review attribution by `utm_campaign`
- Identify top 5 converting pages
- Improve CTA copy on low-converting hubs
- Prepare first benchmark / case study draft from beta partners

## Funnel events

| Stage | Event |
|---|---|
| Homepage / SEO CTA | `homepage_cta_click`, `seo_landing_cta_click` |
| Free tool | `free_tool_open`, `free_tool_calculate` |
| Premium upsell | `free_to_premium_click`, `premium_analyzer_open` |
| Unlock / pricing | `premium_unlock_click`, `pricing_view`, `pricing_cta_click` |
| Beta partner | `beta_partner_open`, `beta_partner_submit` |
| Export | `report_export_click`, `report_print_click`, `report_csv_click` |

## Notes

- No PII in analytics payloads; UTM/referrer only.
- Beta partner attribution is appended to form notes (Firestore rules unchanged).
- Production tracking is no-op until GA4/PostHog is wired; dev mode logs to console.
