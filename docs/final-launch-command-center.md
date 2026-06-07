# SectorCalc Final Launch Command Center

Single operations hub for the first 14 days after launch. Measure first, fix blockers only, no new product surface.

**Related docs:**
- [Quick Launch Checklist](./quick-launch-checklist.md)
- [Launch Incident Response](./launch-incident-response.md)
- [Product Roadmap Freeze](./product-roadmap-freeze.md)
- [30-Day Monetization Sprint](./monetization-sprint-30-day-plan.md)
- [Week-1 Optimization Loop](./week-1-optimization-loop.md)
- [Search Console & IndexNow Runbook](./search-console-indexnow-runbook.md)
- [Conversion Review Playbook](./conversion-review-playbook.md)
- [Cursor Scope Control](./cursor-scope-control.md)

---

## 1. Launch status

**Current status:**

| Area | Status |
|---|---|
| Product surface | ready |
| Free calculators | 100 |
| Premium analyzers | 27 |
| SEO hubs | active |
| Authority guides | active |
| Sitemap | automatic (`/sitemap.xml`) |
| llms/txt files | active |
| Campaign clusters | 8 |
| Conversion tracking | active / no-op safe |
| Roadmap | frozen for 30 days |

**Launch verdict options:**

- **READY** — all blockers clear; share campaigns
- **READY WITH MINOR ISSUES** — minor items in backlog; no blocker; share with caution
- **NOT READY** — one or more blockers open; stop sharing until fixed

Record verdict and date at top of [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md).

---

## 2. Daily command checklist

Run every day for the first 14 days (~20 min). Log notes in daily section of [Week-1 Report Template](./week-1-report-template.md) or revenue dashboard.

### Technical

- [ ] Check production homepage
- [ ] Check `/free-tools`
- [ ] Check `/premium-tools`
- [ ] Check one free calculator (rotate Tier-1: area-converter, oee-calculator, concrete-volume-calculator)
- [ ] Check one premium analyzer (rotate: cnc-oee-loss, carbon-footprint-compliance-risk)
- [ ] Check mobile 390px (no horizontal scroll)
- [ ] Check console/network errors on spot-checked pages
- [ ] Check `sitemap.xml` loads and URL count reasonable
- [ ] Check `robots.txt` allows public routes; disallows admin/api/print

### SEO

- [ ] Check GSC page indexing ([runbook](./search-console-indexnow-runbook.md))
- [ ] Inspect 3 priority URLs ([GSC checklist](./gsc-url-inspection-checklist.md))
- [ ] Review sitemap status in GSC
- [ ] Review discovered/crawled-not-indexed for Tier-1 URLs
- [ ] Submit fixed URLs if needed
- [ ] Run IndexNow if new URLs changed (`npm run seo:indexnow`)

### Conversion

- [ ] Check free tool opens (`free_tool_open`)
- [ ] Check calculate events (`free_tool_calculate`)
- [ ] Check `free_to_premium_click`
- [ ] Check `premium_unlock_click`
- [ ] Check pricing CTA clicks (`pricing_cta_click`)
- [ ] Check beta partner submissions (`beta_partner_submit`)

Event map: [Conversion Event QA](./conversion-event-qa.md).

### Revenue

- [ ] Check highest intent cluster ([first traffic campaigns](./first-traffic-campaigns.md))
- [ ] Check weakest friction point
- [ ] Decide if microcopy fix is needed (data only — [fix rules](./week-1-fix-rules.md))
- [ ] Do **not** change pricing without data ([pricing friction rules](./revenue-pricing-friction-rules.md))

---

## 3. Launch blocker matrix

### BLOCKER

Fix immediately. Run lint, tsc, test, build. Deploy only after pass. See [Launch Incident Response](./launch-incident-response.md) Severity 1.

- production build fail
- route crash
- homepage 500/404
- free calculator result fails
- premium analyzer fails
- sitemap broken
- robots blocks public pages
- admin/api/print in sitemap
- mobile unusable
- secret leak
- entitlement/export leak
- noindex on public route
- canonical wrong on main pages

### MAJOR

Fix within 24 hours. Severity 2 in incident response.

- broken CTA
- broken internal link
- duplicate pricing
- header overflow
- missing metadata on important page
- accordion does not open
- JSON-LD invalid on major page

### MINOR

Backlog unless conversion impact is visible. Severity 3.

- small spacing issue
- small copy issue
- non-critical FAQ gap
- minor card height mismatch

Use [Backlog Intake Template](./backlog-intake-template.md) for non-blocker ideas.

---

## 4. First 14 days operating rhythm

| Day | Focus |
|---|---|
| **Day 1** | Verify deploy; submit sitemap; inspect Tier-1 URLs; run IndexNow; share 2 campaign links |
| **Day 2** | Check GSC coverage; inspect 5 free tool URLs; share manufacturing/construction links |
| **Day 3** | Check conversion events; fix only blockers; outreach 10 beta partners |
| **Day 4** | Review mobile usability; inspect premium analyzer URLs; share logistics/energy links |
| **Day 5** | Review free→premium clicks; improve microcopy only if data shows friction |
| **Day 6** | Review pricing CTA; check beta partner submissions |
| **Day 7** | Fill Week-1 report; choose Week-2 priority |
| **Day 8–14** | Repeat SEO + conversion loop; do not add new product surface; prepare Week-2 scale-up based on data |

Week 2+ continues under [30-Day Monetization Sprint](./monetization-sprint-30-day-plan.md).

---

## 5. Decision rules

Aligned with [Monetization Decision Gates](./monetization-decision-gates.md).

| Signal | Action |
|---|---|
| Traffic is low | Focus on SEO indexing and campaign distribution |
| Free tools open but calculations low | Fix calculator UX, defaults, helper text |
| Calculations high but premium clicks low | Improve “what this estimate misses” CTA |
| Premium previews high but unlock clicks low | Improve report value preview |
| Unlock clicks high but pricing clicks low | Fix pricing clarity |
| Pricing clicks exist | Prioritize checkout/payment completion sprint |
| Beta leads exist but paid intent weak | Prioritize beta proof and case study loop |

---

## 6. Cursor intervention protocol

During roadmap freeze, Cursor follows [Cursor Scope Control](./cursor-scope-control.md).

**Cursor may only do:**

- blocker fixes
- broken link fixes
- metadata fixes
- sitemap fixes
- mobile overflow fixes
- CTA microcopy fixes with data
- docs updates
- test/build/deploy

**Cursor must not do:**

- new calculators
- new schemas
- homepage redesign
- pricing redesign
- new packages
- payment architecture refactor
- admin expansion
- broad refactor
- speculative SEO page explosion

**Every Cursor report must include:**

1. Problem
2. Files changed
3. What changed
4. What did not change
5. Tests
6. Manual QA
7. Deploy
8. Known risk

---

## 7. Launch KPI board

Update weekly. Targets are Week-1 baselines; adjust after Day 7 review.

| KPI | Target | Current | Status |
|---|---:|---:|---|
| Indexed Tier-1 URLs | 80% | | |
| Free tool opens | 100+ | | |
| Free calculations | 30+ | | |
| Free→Premium clicks | 5–10% | | |
| Premium previews | 20+ | | |
| Unlock clicks | 3%+ | | |
| Pricing CTA clicks | 5+ | | |
| Beta partner submits | 3+ | | |
| Export intents | 3+ | | |

Copy metrics into [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md).

---

## 8. Weekly decision

**End of Week 1 — choose one:**

- Continue SEO distribution
- Improve free tool UX
- Improve premium report value
- Improve pricing page
- Complete payment/checkout
- Push beta partner proof

**End of Week 2 — choose one:**

- Payment checkout sprint
- SEO scale sprint
- Premium report proof sprint
- Localization/content sprint

Document choice in dashboard + [Revenue Conversion Review Template](./revenue-conversion-review-template.md).
