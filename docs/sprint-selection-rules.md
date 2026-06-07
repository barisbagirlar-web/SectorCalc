# Sprint Selection Rules

Which backlog items may enter a sprint during the [30-day monetization freeze](./monetization-sprint-30-day-plan.md).

**Related:**
- [Post-launch Growth Backlog](./post-launch-growth-backlog.md)
- [Growth Backlog Scoring Model](./growth-backlog-scoring-model.md)
- [Monetization Decision Gates](./monetization-decision-gates.md)
- [Live KPI Review Runbook](./live-kpi-review-runbook.md)

---

## A task enters sprint only if one is true

1. **It fixes a blocker** — payment leak, export leak, build failure, mobile overflow on Tier-1 URL, broken indexable route, SEO noindex/canonical error, conversion event not firing on primary CTA
2. **It improves a measured conversion bottleneck** — Live KPI verdict is `needs_free_tool_ux`, `needs_premium_value`, `needs_pricing_fix`, or `needs_checkout_fix` **with event counts attached**
3. **It improves indexing of a Tier-1 URL** — GSC coverage or crawl issue on priority matrix URL
4. **It supports an observed revenue signal** — checkout started, payment completed, or pricing CTA cluster with UTM attribution
5. **It is required for payment/security correctness** — webhook, entitlement, auth admin claim, Firestore rules (blocker proof only)

---

## A task does not enter sprint if

- **No data** — status is `needs_data` or evidence fields are empty
- **Only visual preference** — no KPI or GSC delta
- **Adds product surface before revenue proof** — new calculator, schema, dashboard, widget during freeze
- **Increases maintenance without clear gain** — high maintenance score (−4/−5) without P0/P1 evidence
- **Duplicates existing feature** — checkout, entitlement, KPI model already shipped
- **Requires broad refactor without blocker** — billing/auth/admin restructure without production incident

---

## Sprint capacity (freeze period)

| Type | Max per week |
|---|---|
| P0 blockers | Unlimited until clear |
| P1 measured fixes | 1–2 |
| P2 backlog | 0 (review only) |
| New product surface | 0 |

---

## Selection process (weekly)

1. Read [Live KPI Review](/admin/kpi) executive verdict
2. Update [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md)
3. Re-score [backlog items](./post-launch-backlog-items.md)
4. Pick items matching **enters sprint** rules above
5. Explicitly record **decision date** and **owner** on each approved item
6. Reject or park everything else — no side implementation

---

## Cursor agent rule

If a task is classified **backlog only**, Cursor must:

1. **Not implement**
2. Add or update row in [post-launch-backlog-items.md](./post-launch-backlog-items.md)
3. Reference this document in the final report

See [Cursor Scope Control](./cursor-scope-control.md) backlog gate.
