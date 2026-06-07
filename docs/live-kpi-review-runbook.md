# Live KPI Review Runbook

Post-launch operating guide for the SectorCalc live KPI review screen and weekly decision model.

**Admin page:** `/admin/kpi` (Firebase Auth admin claim required)

**Code:** `src/lib/analytics/live-kpi-model.ts`, `src/lib/analytics/live-kpi-decision.ts`

---

## Daily

- Check **traffic** — landing views, SEO landing views, free tool opens
- Check **free calculations** — calculate rate vs opens
- Check **premium clicks** — free→premium, unlock, pricing views/CTAs
- Check **checkout / payment** — checkout started vs payment completed
- Check **beta leads** — beta partner submits (aggregate count only)

---

## Weekly decision

Use the executive verdict from `/admin/kpi` or `getLiveKpiDecision(snapshot)`:

| Verdict | Meaning |
|---|---|
| `needs_traffic` | Not enough free tool opens to evaluate conversion |
| `needs_free_tool_ux` | Opens exist but calculations are weak |
| `needs_premium_value` | Calculations exist but premium interest is weak |
| `needs_pricing_fix` | Unlock intent exists but pricing CTAs are weak |
| `needs_checkout_fix` | Checkout starts but payments do not complete |
| `ready_to_scale` | Payment or strong lead signal — scale top cluster |

Fields returned: `verdict`, `reason`, `nextAction`.

---

## What to do next

| Verdict | Action |
|---|---|
| `needs_traffic` | Publish, share, and index campaign cluster landing pages |
| `needs_free_tool_ux` | Fix form clarity and result visibility on high-traffic free tools |
| `needs_premium_value` | Improve premium CTA copy and locked report preview value |
| `needs_pricing_fix` | Clarify pricing plans and strengthen pricing page CTAs |
| `needs_checkout_fix` | Inspect checkout flow, webhook entitlement, success page |
| `ready_to_scale` | Scale the top-performing campaign cluster and premium analyzer |

---

## Data source (v1 limitation)

`loadLiveKpiEvents()` returns an empty list until a server-side analytics store is wired. The admin page shows the model with an empty snapshot — no crash, no PII.

When wiring events:

- Aggregate only — no email, phone, company name, or message content
- Map `checkout_started` and `checkout_returned_success` from revenue events
- Map SectorCalc conversion events from `event-taxonomy.ts`

Related: [Revenue Sprint Dashboard](./revenue-sprint-dashboard.md), [Conversion Review Playbook](./conversion-review-playbook.md).
