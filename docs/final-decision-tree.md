# Final Decision Tree

Map live signals to **one** next sprint. Evaluate weekly after [Measurement Cadence](./measurement-cadence.md).

**Prerequisite:** Read [Live KPI Review Runbook](./live-kpi-review-runbook.md) verdict or fill [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md).

Evaluate cases **top to bottom** — first matching case wins.

---

## Case 1 — No traffic

**Signal:**
- Low impressions (GSC)
- Low landing views
- Low tool opens

**Decision:** Do **not** change product.

**Work on:**
- GSC URL inspection ([runbook](./search-console-indexnow-runbook.md))
- IndexNow resubmit
- Internal links on existing hubs
- Content distribution ([Controlled Organic Distribution](./controlled-organic-distribution.md))
- Community posts
- Direct outreach

**Next sprint:** **SEO / Distribution Sprint**

---

## Case 2 — Traffic but no calculator usage

**Signal:**
- Landing views exist
- Free tool opens low **or** calculate events low

**Decision:** Fix free tool UX.

**Next sprint:** **Free Tool UX Sprint**

**Allowed fixes:**
- Default values
- Helper text
- Result above fold
- Mobile form usability
- Clearer primary CTA

**Not allowed:** New calculators, new schemas.

---

## Case 3 — Calculations but no premium clicks

**Signal:**
- Free calculations exist
- `free_to_premium_click` low

**Decision:** Fix premium bridge.

**Next sprint:** **Free-to-Premium Conversion Sprint**

**Allowed fixes:**
- “What this estimate misses” block
- Related premium analyzer block
- Premium CTA anchor placement
- Report value copy on free result

---

## Case 4 — Premium previews but no unlock clicks

**Signal:**
- Premium analyzer opens exist
- Unlock clicks low

**Decision:** Fix report value perception.

**Next sprint:** **Premium Report Value Sprint**

**Allowed fixes:**
- Report preview depth (within existing preview gate)
- Hidden drivers explanation
- Threshold interpretation copy
- Suggested action preview

---

## Case 5 — Unlock clicks but no pricing/checkout

**Signal:**
- Unlock clicks exist
- Pricing CTA low **or** checkout starts low

**Decision:** Fix pricing clarity.

**Next sprint:** **Pricing Friction Sprint**

**Allowed fixes:**
- Pro card clarity
- Single report visibility on locked state
- Trust copy
- Plan comparison on existing pricing page

**Not allowed:** Pricing model / price amount changes.

---

## Case 6 — Checkout started but no payment

**Signal:**
- Checkout started events exist
- Payment completed low **or** entitlement missing

**Decision:** Fix checkout / payment reliability.

**Next sprint:** **Checkout Reliability Sprint**

**Allowed fixes:**
- Stripe config / price IDs
- Webhook + signature verify
- Success / cancel pages
- Entitlement persistence
- Payment error handling

See [Final Monetization Verdict](./final-monetization-verdict.md).

---

## Case 7 — Beta leads but weak paid intent

**Signal:**
- Beta partner submits exist
- Pricing / payment signals weak

**Decision:** Run beta proof loop.

**Next sprint:** **Beta Proof Sprint**

**Allowed fixes:**
- Collect structured feedback
- Report usefulness survey
- Benchmark permission flow
- Anonymized sample scenario (real data only)
- Testimonial / case page **only if real and approved**

---

## Case 8 — Paid signals exist

**Signal:**
- Payment completed
- Export intent strong
- Pricing CTA strong

**Decision:** Scale the strongest cluster.

**Next sprint:** **Controlled Scale Sprint**

**Allowed fixes:**
- Distribution ([Controlled Organic Distribution](./controlled-organic-distribution.md))
- Small paid micro-test ($5–10/day, one cluster)
- Top tool CTA iteration
- Top analyzer report value

See [Controlled Scale Sprint](./controlled-scale-sprint.md).

---

## Quick reference

| KPI verdict (Live KPI) | Sprint |
|---|---|
| `needs_traffic` | SEO / Distribution |
| `needs_free_tool_ux` | Free Tool UX |
| `needs_premium_value` | Free-to-Premium Conversion |
| (unlock low, preview high) | Premium Report Value |
| `needs_pricing_fix` | Pricing Friction |
| `needs_checkout_fix` | Checkout Reliability |
| Beta leads, weak payment | Beta Proof |
| `ready_to_scale` | Controlled Scale |

Log chosen case in [Controlled Scale Sprint Report](./controlled-scale-sprint-report.md) or weekly dashboard notes.
