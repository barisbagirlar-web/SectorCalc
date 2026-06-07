# Next Sprint Selector

Select **exactly one** sprint per cycle. No mixed sprint. No new feature sprint without data.

**How to choose:** [Final Decision Tree](./final-decision-tree.md) · [Live KPI Review](/admin/kpi)

---

## 1. SEO / Distribution Sprint

**Use if:** Traffic is low (Case 1).

**Focus:** GSC inspection, IndexNow, internal links, LinkedIn/community, outreach.

**Docs:** [Controlled Organic Distribution](./controlled-organic-distribution.md) · [Search Console Runbook](./search-console-indexnow-runbook.md)

---

## 2. Free Tool UX Sprint

**Use if:** Traffic exists but calculate rate is low (Case 2).

**Focus:** Defaults, helper text, result visibility, mobile form, primary CTA.

**Not allowed:** New calculators.

---

## 3. Free-to-Premium Conversion Sprint

**Use if:** Calculations exist but premium clicks are low (Case 3).

**Focus:** “What this estimate misses”, related premium block, CTA placement.

**KPI verdict:** `needs_premium_value`

---

## 4. Premium Report Value Sprint

**Use if:** Premium previews exist but unlock is low (Case 4).

**Focus:** Preview copy, hidden drivers, threshold interpretation, action preview.

---

## 5. Pricing Friction Sprint

**Use if:** Unlock exists but pricing / checkout starts are low (Case 5).

**Focus:** Pro card clarity, single-report path, trust copy, plan comparison.

**KPI verdict:** `needs_pricing_fix`

**Not allowed:** Price amount or model changes.

---

## 6. Checkout Reliability Sprint

**Use if:** Checkout starts but payment / entitlement fails (Case 6).

**Focus:** Stripe, webhook, success/cancel, entitlement, error handling.

**KPI verdict:** `needs_checkout_fix`

**Docs:** [Stripe Test Checkout Runbook](./stripe-test-checkout-runbook.md) · [Entitlement QA Checklist](./entitlement-qa-checklist.md)

---

## 7. Beta Proof Sprint

**Use if:** Beta leads exist but paid intent is weak (Case 7).

**Focus:** Feedback collection, usefulness survey, benchmark permission, real anonymized scenarios.

**Not allowed:** Fake testimonials or case studies.

---

## 8. Controlled Scale Sprint

**Use if:** Paid, export, or strong pricing signals exist (Case 8).

**Focus:** One cluster, organic rhythm, optional paid micro-test.

**KPI verdict:** `ready_to_scale`

**Docs:** [Controlled Scale Sprint](./controlled-scale-sprint.md)

---

## Selection worksheet

| Question | Answer |
|---|---|
| Date | |
| Primary signal (metric + value) | |
| Decision tree case (1–8) | |
| Selected sprint (1–8) | |
| One allowed fix scope | |
| Success metric for next week | |
| Owner | |

---

## Rules

1. **One sprint at a time**
2. **No mixed sprint** (e.g. SEO + new calculator)
3. **No new feature sprint** without quantitative signal
4. **Blockers override** — hotfix first, then re-select
5. Log selection in [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md)

---

## Cursor task template

```
Sprint: [name]
Signal: [metric, URL, date range]
Case: [1-8]
Allowed scope: [from decision tree]
Out of scope: [new product, pricing, redesign]
Success criteria: [measurable next week]
```

Cursor must pass [Final Operating Boundary](./cursor-scope-control.md#final-operating-boundary).
