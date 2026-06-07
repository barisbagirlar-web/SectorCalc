# Monetization Decision Gates

Data gates for the 30-day monetization sprint. Do not change product surface until the relevant gate is evaluated with real numbers.

**Related docs:**
- [30-Day Monetization Sprint](./monetization-sprint-30-day-plan.md)
- [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md)
- [Conversion Review Playbook](./conversion-review-playbook.md)
- [Week-1 Fix Rules](./week-1-fix-rules.md)

---

## Gate 1 — Traffic exists

**Condition:** At least 500 organic/qualified visits **or** 100 calculator opens.

**If false:** Do not change product. Focus on SEO indexing and campaign distribution.

**Actions:**
- GSC indexing for Tier-1 URLs ([runbook](./search-console-indexnow-runbook.md))
- IndexNow re-submit if needed
- Distribute [first traffic campaigns](./first-traffic-campaigns.md)
- Share SEO landing pages from campaign clusters

---

## Gate 2 — Free tools are used

**Condition:** At least 30% of free tool visitors calculate (`free_tool_calculate` / `free_tool_open`).

**If false:** Fix form UX, defaults, helper text, result visibility.

**Allowed fixes:** validation copy, default values, result panel visibility, mobile form layout. No new calculators.

---

## Gate 3 — Premium interest exists

**Condition:** At least 5–10% of calculators produce `free_to_premium_click` (clicks / calculates on top tools).

**If false:** Improve “what this estimate misses” block and premium CTA anchor text on top traffic tools.

**Reference:** Tier-1 free tools in [SEO refresh priority](../src/lib/seo/seo-refresh-priority.ts).

---

## Gate 4 — Report value exists

**Condition:** Premium preview → unlock click above 3% (`premium_unlock_click` / premium preview opens).

**If false:** Improve report preview, hidden drivers, threshold explanation.

**Allowed fixes:** locked-state copy, preview sections, trust strip — not new schema fields.

---

## Gate 5 — Pricing friction

**Condition:** Unlock click high but pricing CTA low (`pricing_cta_click` / unlock clicks).

**If true:** Improve pricing clarity, single report CTA, trust copy.

**Reference:** [Revenue Pricing Friction Rules](./revenue-pricing-friction-rules.md).

---

## Gate 6 — Paid sprint decision

**If pricing CTA or export intent exists:** Prioritize payment/checkout completion.

**If beta leads exist but paid intent weak:** Prioritize beta proof/case study loop.

**If neither:** Stay on SEO/traffic (Gate 1) or free-tool conversion (Gate 2) until one path shows signal.

Log gate status weekly in [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md).
