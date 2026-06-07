# SectorCalc Revenue Conversion Review

Weekly template for turning traffic and usage data into monetization decisions.

**Helpers:**
- `scoreRevenueIntent()` — `src/lib/analytics/revenue-funnel.ts`
- `rankCampaignsByRevenueIntent()` — `src/lib/campaigns/campaign-revenue-score.ts`
- `rankPremiumAnalyzersByRevenueIntent()` — `src/lib/premium-schema/premium-revenue-score.ts`

**Rules:** [revenue-pricing-friction-rules.md](./revenue-pricing-friction-rules.md)

**Reporting period:** YYYY-MM-DD → YYYY-MM-DD

---

## 1. Executive verdict

Choose one:

- [ ] **READY** — hot intent on pricing/unlock; checkout path is next focus
- [ ] **NEEDS OFFER FIX** — interest exists but pricing/locked copy friction
- [ ] **NEEDS TRAFFIC** — cold intent; funnel top weak
- [ ] **NEEDS REPORT VALUE FIX** — previews/opens OK, unlock/pricing weak

**One-line summary:**

---

## 2. Funnel summary

| Stage | Count | Conversion | Notes |
|---|---:|---:|---|
| Traffic (landing CTAs) | | | |
| Free usage (open → calculate) | | | |
| Premium interest | | | |
| Premium preview | | | |
| Unlock intent | | | |
| Pricing intent | | | |
| Purchase intent (pricing CTA) | | | |
| Lead intent (beta partner) | | | |
| Export intent | | | |

**Overall revenue intent score:**  
**Level (cold / warm / hot):**

---

## 3. Campaign cluster ranking

Paste output from `rankCampaignsByRevenueIntent(CAMPAIGN_CLUSTERS, events)` or fill manually:

| Campaign | Intent score | Level | Action |
|---|---:|---|---|
| manufacturing-hidden-loss | | | |
| construction-cost-overrun | | | |
| logistics-route-cost | | | |
| *(add rows)* | | | |

**Top campaign this week:**

---

## 4. Premium analyzer ranking

| Analyzer | Opens | Unlock | Pricing | Export | Fix |
|---|---:|---:|---:|---:|---|
| cnc-oee-loss | | | | | |
| carbon-footprint-compliance-risk | | | | | |
| construction-project-overrun | | | | | |
| *(add rows)* | | | | | |

**Highest-intent analyzer:**

---

## 5. Pricing diagnosis

- **Pro click rate:** (pricing_cta_click pro / pricing_view)
- **Single report interest:** (single plan CTA clicks)
- **Team interest:** (team plan CTA clicks)
- **Drop-off reason:** (from friction rules doc)

---

## 6. Recommended sprint

Choose **one** focus for the next 7 days:

- [ ] Improve premium report value (locked state + preview)
- [ ] Improve locked state copy only
- [ ] Improve pricing page (layout, Pro dominance, single report visibility)
- [ ] Launch single report checkout push on top analyzer
- [ ] Focus on beta partner proof / case studies
- [ ] Drive more qualified traffic to top campaign cluster

**Rationale:**

---

## 7. Next 7 days

- action 1
- action 2
- action 3

---

## Appendix — sample scoring (dev / manual)

Until GA4 or PostHog export is wired, build event arrays from dev console or future dashboard:

```typescript
import { scoreRevenueIntent } from "@/lib/analytics/revenue-funnel";

const events = [
  { eventName: "free_tool_calculate", toolSlug: "oee-calculator", campaignId: "manufacturing-hidden-loss" },
  { eventName: "free_to_premium_click", premiumSlug: "cnc-oee-loss", campaignId: "manufacturing-hidden-loss" },
  { eventName: "premium_unlock_click", premiumSlug: "cnc-oee-loss", campaignId: "manufacturing-hidden-loss" },
];

scoreRevenueIntent(events);
// → { totalScore, level, strongestStage, recommendedAction }
```

Empty events array returns `{ level: "cold", totalScore: 0 }` — safe for V1 scripts.
