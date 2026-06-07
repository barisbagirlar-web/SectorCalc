# SectorCalc Controlled Scale Sprint

Scale only the channels, clusters, and tools that show measurable traction — not the whole platform.

**Related docs:**
- [Controlled Scale Cluster Selection](./controlled-scale-cluster-selection.md)
- [Controlled Scale Modes](./controlled-scale-modes.md)
- [Paid Micro-Test Runbook](./paid-micro-test-runbook.md)
- [Controlled Organic Distribution](./controlled-organic-distribution.md)
- [Controlled Scale Sprint Report](./controlled-scale-sprint-report.md)
- [Live KPI Review Runbook](./live-kpi-review-runbook.md)
- [Final Monetization Verdict](./final-monetization-verdict.md)
- [Paid Ads Readiness Gate](./paid-ads-readiness-gate.md)
- [Post-launch Growth Backlog](./post-launch-growth-backlog.md)

---

## Goal

Scale only the channels, clusters and tools that show measurable traction.

---

## Scale principle

**Do not scale the whole platform.**  
Scale the **smallest proven growth loop**.

```
Traffic source
  → SEO landing / free tool
  → calculator use
  → premium interest
  → pricing / checkout / beta lead
  → report value feedback
```

Use [Live KPI Review](/admin/kpi) verdict and [campaign revenue score](../src/lib/campaigns/campaign-revenue-score.ts) to pick the loop — not intuition.

---

## Scale gates

A cluster can enter scale only if **at least 3** of these conditions are true:

| # | Condition |
|---|---|
| 1 | Indexed landing page (GSC or sitemap confirmed) |
| 2 | Free tool opens observed |
| 3 | Calculator usage observed (`free_tool_calculate`) |
| 4 | `free_to_premium_click` observed |
| 5 | Premium analyzer preview observed |
| 6 | Unlock or pricing CTA observed |
| 7 | Beta partner lead observed |
| 8 | No mobile blocker (390px Tier-1 URLs) |
| 9 | No checkout/export blocker |

**Max concurrent scale clusters:** 1–3 (primary + optional secondary + backup outreach).

---

## Do not scale if

- Checkout is broken ([Final Monetization Verdict](./final-monetization-verdict.md) NOT READY)
- Premium export leaks without entitlement
- Mobile page is unusable (horizontal scroll, broken layout)
- No tracking (`free_tool_open` / calculate events not firing)
- No free calculation events (opens only = vanity traffic)
- Pricing CTA is broken or missing
- [Paid Ads Readiness Gate](./paid-ads-readiness-gate.md) fails (for paid micro-test)

---

## Sprint cadence

| When | Action |
|---|---|
| Weekly | Review KPI snapshot → select cluster → pick scale mode |
| End of sprint | Fill [Controlled Scale Sprint Report](./controlled-scale-sprint-report.md) |
| Before paid | Re-run monetization + paid readiness gates |

---

## Decision outcomes

| Outcome | Meaning |
|---|---|
| **stop** | Pause spend/distribution — fix blocker or wrong cluster |
| **iterate** | Same cluster, change CTA/copy/landing angle |
| **scale** | Increase effort on proven loop (still bounded) |
| **move to next cluster** | Primary cluster plateaued; promote secondary |

See [Controlled Scale Modes](./controlled-scale-modes.md) for channel-specific actions.
