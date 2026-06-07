# SectorCalc Stop / Measure / Decide

**Current operating mode:** Product development is frozen. Measure live signals, then choose exactly one sprint.

**Related docs:**
- [Final Decision Tree](./final-decision-tree.md)
- [Stop Rules](./stop-rules.md)
- [Measurement Cadence](./measurement-cadence.md)
- [Next Sprint Selector](./next-sprint-selector.md)
- [Final Status](./final-status.md)
- [Live KPI Review Runbook](./live-kpi-review-runbook.md)
- [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md)
- [Cursor Scope Control](./cursor-scope-control.md)

---

## Current mode

Product development is **frozen**.

SectorCalc now has enough surface to test market demand:

| Surface | Count / status |
|---|---|
| Free calculators | 100 |
| Premium analyzers | 27 |
| Premium report / export flow | active |
| Checkout + entitlement path | deployed |
| SEO authority architecture | active |
| Automatic sitemap | `/sitemap.xml` |
| Campaign clusters | 8 |
| Conversion tracking | active / no-op safe |
| KPI review model | `/admin/kpi` |

---

## Rule

**Do not add more product** until real usage data says what to fix.

Every change must be:

- Small
- Tested (`lint`, `tsc`, `test`, `build`)
- Reversible
- Tied to a measured signal

Unmeasured ideas → [Post-launch Backlog Items](./post-launch-backlog-items.md).

---

## Measure first

Every decision must come from **at least one** of:

| Source | What to read |
|---|---|
| Google Search Console | Impressions, CTR, coverage, queries |
| Index coverage | Tier-1 URLs indexed? |
| Calculator usage | `free_tool_open`, `free_tool_calculate` |
| Premium CTA click | `free_to_premium_click` |
| Unlock intent | `premium_unlock_click` |
| Pricing CTA | `pricing_cta_click`, `pricing_view` |
| Checkout started | `checkout_started` |
| Payment completed | webhook + entitlement / `checkout_returned_success` |
| Beta partner submit | `beta_partner_submit` |
| Direct user feedback | Email, beta form, report feedback |

Use [Live KPI Review](/admin/kpi) executive verdict as the weekly summary.

---

## Operating loop

```
STOP  →  no new product surface
MEASURE  →  daily / twice-weekly / weekly cadence
DECIDE  →  final decision tree → one sprint
ACT  →  one Cursor task, tested deploy
REPEAT
```

---

## Sprint selection

After measuring, pick **exactly one** sprint from [Next Sprint Selector](./next-sprint-selector.md).

**No mixed sprint.** No new feature sprint without data.

---

## Escalation

| Situation | Action |
|---|---|
| P0 payment/export leak | Hotfix immediately — [Launch Incident Response](./launch-incident-response.md) |
| SEO indexing blocker | SEO hotfix only — no new pages |
| Mobile blocker | Mobile hotfix only |
| No signal at all | Distribution / SEO sprint — not product |

See [Stop Rules](./stop-rules.md) for full stop conditions.
