# Controlled Scale Modes

Four bounded scale modes — pick **one primary mode per cluster per sprint**.

**Prerequisite:** [Controlled Scale Sprint](./controlled-scale-sprint.md) gates pass for the target cluster.

---

## Mode 1 — Organic SEO scale

**Use when:**
- Pages indexed
- Impressions rising (GSC)
- Low or no paid signal yet

**Actions:**
- Strengthen internal links (hub → free tool → premium analyzer)
- Refresh title/meta if CTR low (data from GSC)
- Add FAQ block from top GSC query (existing page — no new routes)
- Resubmit URL inspection ([Search Console runbook](./search-console-indexnow-runbook.md))
- Refresh authority post copy on existing guide/hub

**Do not:** Add new SEO landing pages during freeze — improve existing Tier-1 URLs only.

---

## Mode 2 — Community scale

**Use when:**
- Niche operators likely to give feedback
- Beta partner proof needed before paid conversion

**Actions:**
- Reddit / niche community post (one cluster pain angle)
- LinkedIn niche post (operator audience)
- Direct outreach ([Week-2 Beta Partner Outreach](./week-2-beta-partner-outreach.md))
- Ask for missing variables / formula fit feedback

**Do not:** Fake case studies, guaranteed savings, or exaggerated claims ([Organic Distribution](./controlled-organic-distribution.md)).

---

## Mode 3 — CTA scale

**Use when:**
- Free tool usage exists
- Premium clicks low (Live KPI: `needs_premium_value`)

**Actions:**
- Improve “what this estimate misses” block on top free tools
- Show related premium analyzer higher on result screen
- Improve locked state copy ([Revenue Pricing Friction Rules](./revenue-pricing-friction-rules.md))
- A/B one CTA per sprint — measure before second change

**Cursor:** Allowed with KPI reference — no new product surface.

---

## Mode 4 — Paid micro-test

**Use only when:**
- Tracking works (events fire or no-op safe)
- Mobile works (390px)
- Checkout works ([Final Monetization Verdict](./final-monetization-verdict.md))
- Free calculation events exist
- Premium CTA path exists
- [Paid Ads Readiness Gate](./paid-ads-readiness-gate.md) passes

**Rules:**
- One cluster only
- One landing page only
- One free tool entry point
- **$5–$10/day max** initial test
- Stop if no calculator usage after meaningful clicks
- Stop if bounce/zero calculate after first 30–50 clicks

**Full procedure:** [Paid Micro-Test Runbook](./paid-micro-test-runbook.md)

---

## Mode selection matrix

| Live KPI verdict | Primary mode |
|---|---|
| `needs_traffic` | Organic SEO + Community |
| `needs_free_tool_ux` | CTA scale (form/result visibility) |
| `needs_premium_value` | CTA scale (premium block) |
| `needs_pricing_fix` | CTA scale (pricing clarity) — no paid |
| `needs_checkout_fix` | **Stop scale** — fix checkout first |
| `ready_to_scale` | Organic + optional paid micro-test |

---

## Stop / lift / iterate

| Signal | Decision |
|---|---|
| Blocker detected | **stop** — all modes |
| Calculate rate &lt; 10% after distribution | **iterate** CTA or landing angle |
| Calculate rate &gt; 25% + premium intent | **scale** organic/community effort |
| Paid: 30–50 clicks, zero calculate | **stop** paid — iterate organic |
| Paid: calculate + premium intent | **lift** budget only after 7-day review (+$5/day max step) |

Log every decision in [Controlled Scale Sprint Report](./controlled-scale-sprint-report.md).
