# Cursor Scope Control

Rules for Cursor / agent tasks during the [30-day monetization sprint](./monetization-sprint-30-day-plan.md) and [product roadmap freeze](./product-roadmap-freeze.md).

---

## Cursor must not

- add new tools
- add new schemas
- redesign homepage
- add packages (npm)
- refactor billing/auth/admin without blocker proof
- change pricing
- change formulas without bug proof
- add new SEO routes, guides, or calculators
- ship debug/schema/migration/pilot/TODO copy in public UI

---

## Cursor may

- fix blockers
- fix broken links
- fix mobile overflow
- fix metadata and canonical/noindex issues
- fix sitemap and indexing issues
- improve measured CTA friction (with data reference in PR)
- update docs
- run tests / build / deploy

Allowed fix types align with [Week-1 Fix Rules](./week-1-fix-rules.md) and [Revenue Pricing Friction Rules](./revenue-pricing-friction-rules.md).

---

## Blocker definition

Treat as **blocker** (fix immediately):

- payment or export leak (premium content exposed without gate)
- mobile horizontal scroll on Tier-1 URLs (390px)
- broken route or 404 on indexable URL
- SEO noindex/canonical error on Tier-1 page
- conversion event not firing on primary CTA
- build/test failure on main branch

Treat as **not blocker** (backlog):

- new feature requests
- cosmetic redesign
- “nice to have” copy without metric drop
- new locale content expansion beyond fixing MISSING_MESSAGE errors on live paths

---

## Every Cursor task must include

1. **Files touched**
2. **What changed**
3. **What did not change** (explicit freeze boundaries)
4. **Test result** (`npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build` as applicable)
5. **Manual QA** (URLs checked, viewport, console)
6. **Known risk**

Use this checklist in PR descriptions and agent final reports.

---

## Backlog routing

New ideas → [Growth Backlog Intake Form](./growth-backlog-intake-form.md) → add to [Post-launch Backlog Items](./post-launch-backlog-items.md) → score via [Growth Backlog Scoring Model](./growth-backlog-scoring-model.md) → weekly [Sprint Selection Rules](./sprint-selection-rules.md) → sprint only if gate met.

Legacy quick intake: [Backlog Intake Template](./backlog-intake-template.md).

---

## Cursor backlog gate

Before Cursor applies any new task, classify it:

| Class | Action |
|---|---|
| **blocker** | Implement immediately — payment/export leak, build failure, Tier-1 mobile overflow, broken indexable route, SEO noindex/canonical error, conversion event not firing |
| **revenue fix** | Implement only with KPI/revenue signal reference |
| **SEO indexing fix** | Implement only for Tier-1 URL with GSC/crawl evidence |
| **conversion fix** | Implement only with Live KPI verdict + event counts |
| **backlog only** | **Do not implement** — add to [post-launch-backlog-items.md](./post-launch-backlog-items.md) |

If classified **backlog only**:

1. Do not write product code for the idea.
2. Add or update a row in [post-launch-backlog-items.md](./post-launch-backlog-items.md) using [growth-backlog-intake-form.md](./growth-backlog-intake-form.md).
3. Set status to `needs_data` unless evidence and score ≥ 15 (or blocker override).
4. Reference [Post-launch Growth Backlog](./post-launch-growth-backlog.md) in the final report.

Cursor must not implement unmeasured ideas during the [product roadmap freeze](./product-roadmap-freeze.md).

---

## Controlled Scale Sprint boundary

During [Controlled Scale Sprint](./controlled-scale-sprint.md), Cursor **may**:

- fix tracked conversion blockers
- improve CTA copy based on KPI / event data
- improve internal links on existing pages
- update SEO snippets from GSC query evidence
- fix mobile / console / network errors on Tier-1 URLs
- update campaign and scale sprint docs

Cursor **must not**:

- add new product surface (calculators, schemas, dashboards)
- add calculators or premium schemas
- redesign homepage
- change pricing
- start paid ads automatically
- expand paid budget without measured results in [Controlled Scale Sprint Report](./controlled-scale-sprint-report.md)

Paid micro-tests are **operator-only** — see [Paid Micro-Test Runbook](./paid-micro-test-runbook.md).

---

## Related workflow

- [Cursor Workflow](./cursor-workflow.md)
- [Conversion Event QA](./conversion-event-qa.md)
- [Deployment Checklist](./deployment-checklist.md)
