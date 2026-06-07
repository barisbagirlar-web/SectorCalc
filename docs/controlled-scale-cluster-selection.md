# Controlled Scale Cluster Selection

Rules for choosing which campaign cluster to scale — max **1–3** clusters at a time.

**Data sources:**
- [Campaign clusters](../src/lib/campaigns/campaign-clusters.ts)
- [Campaign revenue score](../src/lib/campaigns/campaign-revenue-score.ts)
- [Live KPI model](../src/lib/analytics/live-kpi-model.ts)
- GSC coverage + query reports
- [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md)

---

## Rank clusters by

Priority order (highest signal wins ties):

1. Indexed URL status
2. Free tool opens
3. Calculate events
4. Premium CTA clicks (`free_to_premium_click`)
5. Premium preview opens
6. Unlock clicks
7. Pricing CTA clicks
8. Beta partner submits
9. Payment events (`checkout_started`, payment completed)

Use `rankCampaignsByRevenueIntent()` when event records include `campaignId` (UTM).

---

## Select

| Role | Selection rule |
|---|---|
| **Primary cluster** | Highest total signal across rank criteria |
| **Secondary cluster** | Highest SEO opportunity (impressions rising, CTR fixable, indexed hub) |
| **Backup cluster** | Highest beta/outreach potential (community fit, partner feedback) |

Do not activate more than **three** clusters in the same sprint.

---

## Default first candidates

These clusters ship with strong pain language, premium analyzers, and SEO hubs:

| Priority | Cluster ID | Landing hub |
|---|---|---|
| 1 | `manufacturing-hidden-loss` | `/seo/manufacturing-cost-calculators` |
| 2 | `construction-cost-overrun` | `/seo/construction-cost-calculators` |
| 3 | `energy-carbon-exposure` | `/seo/energy-carbon-calculators` |

**Reason:** Clear hidden-loss pain, premium report logic, and established free-tool → premium analyzer paths.

Replace defaults when live KPI data shows another cluster outperforming on calculate + premium intent.

---

## Scale gate per cluster

Before scaling a cluster, confirm **≥ 3** items from [Controlled Scale Sprint](./controlled-scale-sprint.md) scale gates.

If gate fails → **do not scale**; log in [Controlled Scale Sprint Report](./controlled-scale-sprint-report.md) as `stop` or `iterate`.

---

## Cluster → mode mapping

| Signal pattern | Recommended mode |
|---|---|
| Indexed, impressions up, low calculate | Organic SEO scale |
| Calculate OK, premium clicks low | CTA scale |
| Niche operators, low payment signal | Community scale |
| All gates pass + paid readiness | Paid micro-test (one cluster only) |

See [Controlled Scale Modes](./controlled-scale-modes.md).
