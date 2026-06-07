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

New ideas → [Backlog Intake Template](./backlog-intake-template.md) → review at weekly gate check → sprint only if [decision gate](./monetization-decision-gates.md) is met.

---

## Related workflow

- [Cursor Workflow](./cursor-workflow.md)
- [Conversion Event QA](./conversion-event-qa.md)
- [Deployment Checklist](./deployment-checklist.md)
