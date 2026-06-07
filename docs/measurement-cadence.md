# Measurement Cadence

How often to measure — and what to record before any product change.

**Tools:**
- [Live KPI Review](/admin/kpi) — aggregate funnel (empty until event storage wired)
- [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md) — weekly log
- Google Search Console — impressions, CTR, coverage
- [Final Monetization Verdict](./final-monetization-verdict.md) — payment readiness

---

## Daily — 15 minutes

| Check | Source |
|---|---|
| Production page spot check (home, one free tool, one premium) | Manual |
| GSC critical URL status | Search Console |
| Free tool opens | Analytics / KPI |
| Calculations | Analytics / KPI |
| Premium clicks | Analytics / KPI |
| Checkout / payment errors | Stripe dashboard, Functions logs |
| Beta submits | Admin leads / Firestore |

**Action if anomaly:** Note in dashboard; if P0 → hotfix, do not start new work.

---

## Twice weekly — 45 minutes

| Check | Action |
|---|---|
| Top landing pages | GSC + UTM — which cluster gets traffic? |
| Top free tools | Opens vs calculate rate |
| Top premium analyzers | Preview vs unlock |
| GSC queries | CTR opportunities on existing pages |
| CTA friction | One observed drop-off point |
| Mobile issues | 390px spot check on top URL |

Update [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md) mid-week notes.

---

## Weekly — 90 minutes

| Step | Time | Output |
|---|---|---|
| Fill revenue dashboard | 20 min | Week column complete |
| Review Live KPI verdict | 10 min | `needs_*` or `ready_to_scale` |
| Run [Final Decision Tree](./final-decision-tree.md) | 15 min | Case 1–8 selected |
| Select **one** sprint | 10 min | [Next Sprint Selector](./next-sprint-selector.md) |
| Create **one** Cursor task | 15 min | Data reference in task description |
| Deploy only tested fixes | 20 min | Build green, manual QA URLs |

**Rule:** No second sprint until current sprint metrics reviewed.

---

## Minimum data before any change

At least **one** quantitative signal + **one** affected URL or slug in the task/PR description.

Examples:
- “`/tools/free/oee-calculator` calculate rate 8% (opens 120, calc 10)”
- “GSC: `/seo/manufacturing-cost-calculators` impressions +40%, CTR 1.2%”
- “Live KPI: `needs_premium_value`, free_to_premium 2 / calc 45”

No signal → backlog only → no implementation.

---

## 7-day measurement window

On entering [Final Status](./final-status.md) operating mode:

1. **Days 1–7:** Measure only — no product surface changes
2. **Day 7:** Decision tree + one sprint
3. **Days 8–14:** Execute one sprint; measure daily
4. **Day 14:** [Controlled Scale Sprint Report](./controlled-scale-sprint-report.md) or dashboard review

Repeat.
