# SectorCalc Week-2 Scale-Up Plan

Turn Week-1 signals into focused traffic, conversion and revenue learning. No new product surface — scale what already works.

**Related docs:**
- [Week-2 Operating Calendar](./week-2-operating-calendar.md)
- [Week-2 Cluster Scale-Up Matrix](./week-2-cluster-scale-up-matrix.md)
- [Week-2 Top Tool Template](./week-2-top-tool-template.md)
- [Final Launch Command Center](./final-launch-command-center.md)
- [Monetization Decision Gates](./monetization-decision-gates.md)
- [Week-1 Report Template](./week-1-report-template.md)
- [Revenue Conversion Review Template](./revenue-conversion-review-template.md)
- [Cursor Scope Control](./cursor-scope-control.md)

---

## Goal

Turn Week-1 signals into focused traffic, conversion and revenue learning.

---

## Scale-up rule

**Do not scale everything.**

Scale only:

- the strongest **3 clusters**
- the strongest **10 free tools**
- the strongest **5 premium analyzers**

Score clusters with [campaign revenue score](../src/lib/campaigns/campaign-revenue-score.ts) and funnel events from [revenue funnel](../src/lib/analytics/revenue-funnel.ts). Log choices in the cluster matrix.

---

## Required Week-1 inputs

Pull from [Week-1 Report](./week-1-report-template.md) and [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md):

- indexed critical URLs
- free tool opens
- free calculations
- free_to_premium_click
- premium preview opens
- unlock clicks
- pricing CTA clicks
- beta partner submits
- top search queries (GSC)
- mobile issues
- blocker list

**If inputs are missing:** stay in Distribution Mode until Gate 1 is met ([decision gates](./monetization-decision-gates.md)).

---

## Decision — choose one Week-2 mode

Evaluate gates in order. Pick the **first mode that matches** your weakest link (fix the bottleneck, do not stack modes).

### 1. Distribution Mode

**Use when:** traffic is low (Gate 1 not met).

**Focus:**

- Search Console inspection ([runbook](./search-console-indexnow-runbook.md))
- IndexNow re-submit if URLs changed
- LinkedIn/community posts ([launch content pack](./launch-campaign-content-pack.md))
- outreach ([beta partner outreach](./week-2-beta-partner-outreach.md))
- internal links from SEO hubs

### 2. Free Tool UX Mode

**Use when:** traffic exists but calculate rate is low (Gate 2 not met).

**Focus:**

- default values
- helper text
- result visibility
- mobile form usability

See [Week-2 Top Tool Template](./week-2-top-tool-template.md) and [Week-1 Fix Rules](./week-1-fix-rules.md).

### 3. Premium Value Mode

**Use when:** free calculations exist but premium clicks are low (Gate 3 not met).

**Focus:**

- “what this estimate misses” block
- premium CTA anchor text
- report preview clarity
- locked state copy

### 4. Monetization Mode

**Use when:** unlock/pricing/export intent exists (Gates 4–6).

**Focus:**

- checkout/payment completion
- single report offer clarity
- pricing page copy
- export paywall verification

Do **not** open payment sprint without pricing CTA or export intent signal.

---

## Week-2 outputs

By Day 14:

- [ ] Week-2 mode documented
- [ ] Top 3 clusters selected in [cluster matrix](./week-2-cluster-scale-up-matrix.md)
- [ ] Top tool review filled ([template](./week-2-top-tool-template.md))
- [ ] SEO actions logged ([SEO scale-up rules](./week-2-seo-scale-up-rules.md))
- [ ] Paid ads gate evaluated ([readiness gate](./paid-ads-readiness-gate.md))
- [ ] Next sprint choice recorded (payment / SEO scale / beta proof / premium value)

---

## Hard limits (roadmap freeze)

No new calculators, schemas, SEO pages, guides, pricing changes, or homepage redesign. See [Product Roadmap Freeze](./product-roadmap-freeze.md).
