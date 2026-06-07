# Revenue Sprint Dashboard

Weekly tracking sheet for the [30-day monetization sprint](./monetization-sprint-30-day-plan.md). Update every Friday (or end of each sprint week).

**Data sources:** Analytics conversion events, GSC, [Conversion Review Playbook](./conversion-review-playbook.md).

**Live admin view:** `/admin/kpi` — [Live KPI Review Runbook](./live-kpi-review-runbook.md)

---

## Weekly metrics

| Metric | Week 1 | Week 2 | Week 3 | Week 4 | Decision |
|---|---:|---:|---:|---:|---|
| Indexed critical URLs | | | | | |
| Organic impressions | | | | | |
| Free tool opens | | | | | |
| Free calculations | | | | | |
| Free→Premium clicks | | | | | |
| Premium previews | | | | | |
| Unlock clicks | | | | | |
| Pricing CTA clicks | | | | | |
| Checkout started | | | | | |
| Payment completed | | | | | |
| Beta partner submits | | | | | |
| Export intents | | | | | |

**Weekly decision fields** (from `/admin/kpi` executive verdict):

| Field | Values |
|---|---|
| `verdict` | `needs_traffic`, `needs_free_tool_ux`, `needs_premium_value`, `needs_pricing_fix`, `needs_checkout_fix`, `ready_to_scale` |
| `reason` | Human-readable funnel diagnosis |
| `nextAction` | Single recommended action for the week |

**Derived rates (calculate manually):**

| Rate | Formula | W1 | W2 | W3 | W4 |
|---|---|---:|---:|---:|---:|
| Calculate rate | calculations / opens | | | | |
| Free→Premium rate | free_to_premium / calculations | | | | |
| Unlock rate | unlock / premium previews | | | | |
| Pricing CTR | pricing_cta / unlock (or pricing views) | | | | |

---

## Gate status

| Gate | Condition met? | Notes |
|---|---|---|
| Gate 1 — Traffic | | |
| Gate 2 — Calculate | | |
| Gate 3 — Premium interest | | |
| Gate 4 — Report value | | |
| Gate 5 — Pricing friction | | |
| Gate 6 — Paid sprint | | |

Reference: [Monetization Decision Gates](./monetization-decision-gates.md).

---

## Decision notes

**Strongest cluster:** _campaign / SEO hub / free tool with best intent signal_

**Weakest friction:** _drop-off stage and hypothesized cause_

**Fix shipped this week:** _link to PR or doc; metric before/after_

**Next sprint choice:** _single report / Pro / beta proof / SEO scale / report value_

---

## Top URLs (optional)

| URL | Opens | Calculates | Premium clicks | Notes |
|---|---:|---:|---:|---|
| | | | | |
| | | | | |
| | | | | |

Tier-1 reference: [week-1-priority-url-matrix.md](./week-1-priority-url-matrix.md), [seo-refresh-priority](../src/lib/seo/seo-refresh-priority.ts).
