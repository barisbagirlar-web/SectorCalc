# Paid Micro-Test Runbook

Small-budget paid search test — **one cluster, one landing, $5–$10/day max**.

**Prerequisite:** [Paid Ads Readiness Gate](./paid-ads-readiness-gate.md) must pass.

**Related:** [Controlled Scale Modes](./controlled-scale-modes.md) Mode 4

---

## Before starting

Confirm all pass:

- [ ] Production site works (`https://sectorcalc-bf412.web.app` or custom domain)
- [ ] Mobile works (390px — no horizontal scroll on landing + calculator)
- [ ] Pricing works (`/en/pricing`)
- [ ] Checkout works (Stripe test or live — [Stripe Test Checkout Runbook](./stripe-test-checkout-runbook.md))
- [ ] Analytics events fire or no-op safely (`checkout_started`, `free_tool_calculate`)
- [ ] Premium locked CTA works (no export without entitlement)
- [ ] Landing page indexed or indexable (GSC URL inspection)

**If any fail → do not start paid.**

---

## Campaign setup

| Field | Rule |
|---|---|
| Clusters | **One** only |
| Pain angle | One headline from cluster `primaryPain` |
| Landing URL | Cluster SEO hub or top free tool |
| CTA | Single primary action (calculate) |
| Keywords | Exact or phrase intent — **no broad campaign** |
| Budget | **$5–$10/day** initial |
| Geo | Match target audience (default: US/EU English) |

UTM: use cluster `utmCampaign` from [campaign clusters](../src/lib/campaigns/campaign-clusters.ts).

---

## Example test

| Field | Value |
|---|---|
| Cluster | `manufacturing-hidden-loss` |
| Landing | `/en/seo/manufacturing-cost-calculators` |
| Primary free tool | `/en/tools/free/oee-calculator` |
| Premium analyzer | `/en/tools/premium-schema/cnc-oee-loss` |
| CTA | Calculate OEE loss exposure |
| Budget | $5–$10/day |

---

## Stop rules (pause within 48h if triggered)

- 30–50 clicks and **no** calculator usage
- Mobile issue detected on ad landing path
- Checkout issue detected
- Irrelevant search terms dominating spend (&gt;30% off-intent)
- Zero premium CTA clicks after meaningful calculation volume (&gt;20 calculates)

---

## Scale rules (lift budget only after 7-day review)

All must be true before increasing budget (max +$5/day per step):

- Calculate rate **&gt; 25%** (calculations / landing sessions or tool opens)
- `free_to_premium_click` **&gt; 5%** of calculations (or unlock/pricing intent observed)
- Pricing or unlock intent appears in funnel
- No technical blocker open
- [Final Monetization Verdict](./final-monetization-verdict.md) READY or READY WITH RISK cleared for paid

**Never** scale budget without measured improvement vs prior 7-day baseline.

---

## Weekly log

Record in [Controlled Scale Sprint Report](./controlled-scale-sprint-report.md):

- Spend, clicks, impressions
- Free opens, calculations, premium clicks
- Decision: stop / iterate / scale / move cluster

---

## Cursor rule

Cursor **must not** start paid ads automatically. Paid setup is operator-only.
