# SectorCalc Post-launch Growth Backlog

Controlled intake for all post-launch ideas — features, SEO content, premium analyzers, and technical improvements.

**Related docs:**
- [Growth Backlog Scoring Model](./growth-backlog-scoring-model.md)
- [Growth Backlog Intake Form](./growth-backlog-intake-form.md)
- [Post-launch Backlog Items](./post-launch-backlog-items.md)
- [Sprint Selection Rules](./sprint-selection-rules.md)
- [Product Roadmap Freeze](./product-roadmap-freeze.md)
- [Cursor Scope Control](./cursor-scope-control.md)
- [Live KPI Review Runbook](./live-kpi-review-runbook.md)

---

## Purpose

Prevent uncontrolled product expansion and prioritize work by traffic, conversion, revenue, and risk impact.

**Core rules:**

- New ideas are **not implemented directly** — they become backlog items.
- Sprint work requires **score + evidence** (or blocker override).
- Items without data stay in **`needs_data`** status.
- Revenue blockers rank highest; SEO indexing blockers rank highest among non-revenue work.
- Large refactors require **production risk proof**.

---

## Backlog categories

| # | Category | Examples |
|---|---|---|
| 1 | Revenue | Pricing clarity, checkout CTA, single-report offer |
| 2 | SEO | Indexing fixes, programmatic pages, comparison pages |
| 3 | Conversion UX | Free tool form, CTA placement, mobile friction |
| 4 | Premium report value | Preview depth, sample gallery, locked-state copy |
| 5 | Payment / entitlement | Webhook verification, entitlement persistence |
| 6 | Beta partner proof | Case studies, proof pages from real feedback |
| 7 | Technical debt | Build failures, type errors, dead code (blocker-gated) |
| 8 | Localization | TR/ES/DE content after EN baseline |
| 9 | Content authority | Guides, authority blocks, hub copy |
| 10 | New product surface | New calculators, schemas, dashboards, widgets |

Categories 1–6 are sprint-eligible when measured. Category 10 is **parked by default** during the 30-day freeze.

---

## Status values

| Status | Meaning |
|---|---|
| `new` | Just captured — not scored yet |
| `needs_data` | Hypothesis valid but no KPI/GSC/event evidence |
| `candidate` | Score ≥ 15 or blocker override — ready for sprint review |
| `approved` | Explicitly approved for next sprint |
| `in_progress` | Active sprint work |
| `shipped` | Done — link PR/deploy note |
| `rejected` | Out of scope or no revenue path |
| `parked` | Deferred — score too low or freeze violation |

---

## Priority levels

| Level | Definition |
|---|---|
| **P0** | Revenue, security, or indexing blocker — fix immediately |
| **P1** | Measured conversion or SEO opportunity with evidence |
| **P2** | Strong hypothesis, low risk, moderate score |
| **P3** | Nice-to-have — backlog only |
| **P4** | Parked until freeze lifts or paid-user baseline exists |

**Override order:**

1. P0 revenue / payment / entitlement blocker
2. P0 SEO indexing blocker on Tier-1 URL
3. P1 measured conversion bottleneck (from [Live KPI Review](./live-kpi-review-runbook.md))
4. P1 revenue signal (checkout, payment, beta lead)
5. Scored backlog (see [scoring model](./growth-backlog-scoring-model.md))

---

## Workflow

```
Idea → Intake form → Score → Status → Weekly gate review → Sprint (if rules pass)
```

1. Capture idea in [Growth Backlog Intake Form](./growth-backlog-intake-form.md)
2. Add row to [Post-launch Backlog Items](./post-launch-backlog-items.md)
3. Score using [Growth Backlog Scoring Model](./growth-backlog-scoring-model.md)
4. Apply [Sprint Selection Rules](./sprint-selection-rules.md) at weekly review
5. Cursor agents must follow [Cursor Scope Control](./cursor-scope-control.md) backlog gate

---

## Freeze alignment

During the [30-day monetization sprint](./monetization-sprint-30-day-plan.md):

- **Allowed:** blocker fixes, measured CTA/pricing friction, indexing fixes, docs
- **Not allowed:** new calculators, schemas, SEO routes, homepage redesign, pricing model change
- **Route to backlog:** everything else → this document

Legacy intake template: [Backlog Intake Template](./backlog-intake-template.md) (still valid for quick notes).
