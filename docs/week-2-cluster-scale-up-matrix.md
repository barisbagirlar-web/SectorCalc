# Week-2 Cluster Scale-Up Matrix

Score and prioritize the 8 campaign clusters for Week-2. Fill after Week-1 report is complete.

**Related docs:**
- [Week-2 Scale-Up Plan](./week-2-scale-up-plan.md)
- [First Traffic Campaigns](./first-traffic-campaigns.md)
- [Conversion Review Playbook](./conversion-review-playbook.md)

Cluster IDs match `CAMPAIGN_CLUSTERS` in `src/lib/campaigns/campaign-clusters.ts`.

---

## Matrix

| Cluster | Traffic | Calculate | Premium Click | Pricing/Lead | Decision | Action |
|---|---:|---:|---:|---:|---|---|
| manufacturing-hidden-loss | | | | | | |
| construction-cost-overrun | | | | | | |
| logistics-route-cost | | | | | | |
| restaurant-food-margin | | | | | | |
| energy-carbon-exposure | | | | | | |
| agriculture-yield-loss | | | | | | |
| business-finance-calculators | | | | | | |
| unit-conversion-traffic | | | | | | |

**Column notes:**

- **Traffic** — sessions or landing CTA clicks on cluster `landingHref`
- **Calculate** — calculate rate on cluster free tools
- **Premium Click** — `free_to_premium_click` from cluster free tools
- **Pricing/Lead** — `pricing_cta_click` + `beta_partner_submit` attributed to cluster UTM

---

## Cluster reference

| Cluster ID | Landing | Primary pain |
|---|---|---|
| manufacturing-hidden-loss | `/seo/manufacturing-cost-calculators` | Scrap, OEE drift, setup overrun |
| construction-cost-overrun | `/seo/construction-cost-calculators` | Bid margin, rework, subcontractor exposure |
| logistics-route-cost | `/seo/logistics-route-calculators` | Deadhead, fuel drift, route cost |
| restaurant-food-margin | `/industries/restaurant` | Food cost drift, portion variance |
| energy-carbon-exposure | `/seo/energy-carbon-calculators` | Peak load, carbon compliance |
| agriculture-yield-loss | `/seo/agriculture-calculators` | Irrigation waste, yield variance |
| business-finance-calculators | `/seo/finance-business-calculators` | Break-even blind spots, cash gaps |
| unit-conversion-traffic | `/seo/unit-conversion-calculators` | Conversion errors in estimates |

---

## Decision rules

| Signal | Decision | Action |
|---|---|---|
| Traffic high + premium click high | **Scale** | More posts, internal links, hub FAQ; keep CTA |
| Traffic high + premium click low | **Improve CTA** | “What this estimate misses”; premium anchor text |
| Traffic low + indexed | **Distribution** | GSC inspect, campaign share, outreach |
| Not indexed | **SEO fix** | Canonical, internal links, request indexing ([SEO rules](./week-2-seo-scale-up-rules.md)) |
| Beta leads high | **Beta proof loop** | Case study outreach; do not add product |
| Pricing intent high | **Payment sprint candidate** | Pricing clarity; checkout QA — not ads yet unless [paid ads gate](./paid-ads-readiness-gate.md) passes |

---

## Select top 3

After filling the matrix:

1. Rank by premium decision intent (premium click + pricing/lead)
2. Break ties with calculate rate and indexing status
3. Document top 3 cluster IDs in Week-2 operating calendar Day 8
4. Do not actively scale clusters ranked 4–8 until Week-3 unless a blocker fix is needed
