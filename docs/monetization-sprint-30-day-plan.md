# SectorCalc 30-Day Monetization Sprint

Revenue-focused sprint after launch readiness. No new features — measure, fix friction, decide next monetization path.

**Related docs:**
- [Product Roadmap Freeze](./product-roadmap-freeze.md)
- [Monetization Decision Gates](./monetization-decision-gates.md)
- [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md)
- [Conversion Review Playbook](./conversion-review-playbook.md)
- [Revenue Conversion Review Template](./revenue-conversion-review-template.md)
- [First Traffic Campaigns](./first-traffic-campaigns.md)
- [Launch Campaign Content Pack](./launch-campaign-content-pack.md)

---

## Sprint goal

Validate whether SectorCalc can convert organic/tool traffic into premium intent, beta partner leads or paid report demand.

**Success signals (any one is progress):**

- first real user traffic on Tier-1 URLs
- first beta partner lead submission
- first premium unlock intent (`premium_unlock_click`)
- first pricing CTA signal (`pricing_cta_click`)
- first single-report purchase readiness (export intent + pricing path QA)
- first conversion learning loop completed (weekly review → one measured fix)

---

## North Star Metric

**Premium decision intent** — sum of:

- `free_to_premium_click`
- `premium_unlock_click`
- `pricing_cta_click`
- `beta_partner_submit`

Track daily and weekly. Log in [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md).

---

## Primary KPIs

| KPI | Source | Notes |
|---|---|---|
| indexed critical URLs | GSC Pages + [priority matrix](./week-1-priority-url-matrix.md) | Tier-1 indexed count |
| organic impressions | GSC Performance | Week-over-week trend |
| free tool opens | `free_tool_open` | By tool slug |
| free tool calculations | `free_tool_calculate` | Open→calculate rate |
| free→premium click rate | `free_to_premium_click` / calculates | Per top tool |
| premium analyzer previews | `premium_analyzer_open`, `premium_calculate` | Tier-1 analyzers |
| premium unlock clicks | `premium_unlock_click` | Preview→unlock |
| pricing CTA clicks | `pricing_cta_click` | From pricing page |
| beta partner submissions | `beta_partner_submit` | Form completions |
| export intent clicks | `report_export_click` | Locked export CTAs |

Event names verified in [Conversion Event QA](./conversion-event-qa.md).

---

## Week 1 — Indexing + QA + first traffic

- submit sitemap
- inspect priority URLs ([GSC checklist](./gsc-url-inspection-checklist.md))
- share 8 SEO landing pages ([first traffic campaigns](./first-traffic-campaigns.md))
- test campaign UTM links
- collect first usage events
- run [Week-1 Optimization Loop](./week-1-optimization-loop.md) daily

**Exit criteria:** Gate 1 traffic signal OR clear indexing blocker list documented.

---

## Week 2 — Free tool conversion

- identify top 10 free tools by opens
- improve free-to-premium CTA on top tools (data only — see [fix rules](./week-1-fix-rules.md))
- check mobile usability on top tools (390px)
- inspect premium CTA friction on highest-traffic pages

**Exit criteria:** Gate 2 calculate rate baseline OR UX fix shipped with before/after metric.

---

## Week 3 — Premium report value

- review premium preview opens by analyzer
- improve locked state if unlock rate low ([pricing friction rules](./revenue-pricing-friction-rules.md))
- improve pricing link if pricing CTR low
- push beta partner outreach ([launch content pack](./launch-campaign-content-pack.md))

**Exit criteria:** Gate 3 or Gate 4 signal, or documented friction hypothesis.

---

## Week 4 — Monetization decision

Review [decision gates](./monetization-decision-gates.md) and choose **one** next sprint:

| Option | When to choose |
|---|---|
| **Single report checkout sprint** | Export intent + pricing CTA exist; payment path is the bottleneck |
| **Pro subscription sprint** | Repeat unlock clicks; users hit multiple analyzers |
| **Beta partner proof sprint** | Beta leads exist; paid intent weak — need case study loop |
| **SEO scale sprint** | Traffic weak; indexing/conversion healthy on small sample |
| **Premium report value sprint** | Unlock low; preview opens high — report value unclear |

Document choice in [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md) and [Week-1 Report Template](./week-1-report-template.md) (adapt for Week 4).

---

## Out of scope (entire sprint)

See [Product Roadmap Freeze](./product-roadmap-freeze.md). Cursor agents must follow [Cursor Scope Control](./cursor-scope-control.md).
