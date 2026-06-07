# Paid Ads Readiness Gate

**Do not start paid ads** until this gate passes. Week-2 default is organic distribution and CTA improvement.

**Related docs:**
- [Week-2 Scale-Up Plan](./week-2-scale-up-plan.md)
- [Quick Launch Checklist](./quick-launch-checklist.md)
- [Conversion Event QA](./conversion-event-qa.md)
- [Product Roadmap Freeze](./product-roadmap-freeze.md)

---

## Required (all must pass)

- [ ] tracking works (`free_tool_open`, `free_tool_calculate`, `free_to_premium_click` fire on live site)
- [ ] pricing page works (`/pricing` loads; `pricing_cta_click` fires)
- [ ] premium locked CTA works (no export/entitlement leak)
- [ ] at least one free tool converts to premium click (organic or campaign)
- [ ] mobile UX passes (390px, Tier-1 URLs)
- [ ] no console/network errors on landing + calculator journey
- [ ] clear offer exists (free calculator → premium analyzer → pricing path documented)

---

## Minimum signal (all must pass)

| Metric | Minimum |
|---|---:|
| Free tool opens | 100 |
| Calculations | 30 |
| Premium clicks | 5 |
| Pricing CTA **or** beta partner submit | 1 |

If not met: **Do not spend.** Continue organic distribution and CTA improvement.

---

## Gate evaluation

| Check | Pass? | Notes |
|---|---|---|
| Required checklist | | |
| Minimum signal | | |
| [Paid ads readiness](#required-all-must-pass) | | |

**Evaluated on:** YYYY-MM-DD  
**Decision:** NOT READY / READY FOR $5–10/day TEST

---

## Starter campaign (only after gate)

- **Budget:** $5–10/day test
- **Scope:** one cluster only ([cluster matrix](./week-2-cluster-scale-up-matrix.md))
- **Keyword:** exact pain keyword from cluster `primaryPain`
- **Landing:** cluster SEO hub or top free tool with calculator above fold
- **Measure:** calculate + premium click (not impressions alone)
- **Stop rule:** pause if no calculator usage after 7 days or CPA undefined

Clusters with `search_ads` in `recommendedChannels`: construction-cost-overrun, business-finance-calculators, unit-conversion-traffic.

**Cursor/automation:** this doc does not authorize auto-starting ads — human approval required after gate log.

---

## If gate fails

| Failure | Action |
|---|---|
| Tracking broken | Blocker fix — Severity 1 |
| No premium clicks | Premium Value Mode — not ads |
| Low opens | Distribution Mode |
| Mobile fail | Blocker fix before any spend |
