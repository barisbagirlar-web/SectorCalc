# Post-launch Backlog Items

Initial growth backlog — seeded at launch. Update status and scores at weekly gate review.

**Scoring:** [Growth Backlog Scoring Model](./growth-backlog-scoring-model.md)  
**Sprint rules:** [Sprint Selection Rules](./sprint-selection-rules.md)  
**Intake:** [Growth Backlog Intake Form](./growth-backlog-intake-form.md)

| # | Title | Category | Priority | Status | Notes |
|---:|---|---|---|---|---|
| 1 | Complete Stripe webhook production verification | Payment / entitlement | P0 | candidate | Blocker override — payment correctness |
| 2 | Add real event storage if analytics no-op remains | Conversion / Analytics | P0/P1 | needs_data | Required if no GA4/PostHog wired |
| 3 | Improve top 5 free tool premium CTA based on events | Conversion UX | P1 | needs_data | KPI: `needs_premium_value` |
| 4 | Strengthen premium report preview if unlock low | Premium report value | P1 | needs_data | KPI: unlock vs pricing CTA |
| 5 | Add single report checkout offer to premium locked state if pricing intent appears | Revenue | P1 | needs_data | After pricing_view / unlock signal |
| 6 | Create first beta partner proof page after real feedback | Beta partner proof | P1 | needs_data | Requires approved beta submission |
| 7 | Expand programmatic SEO from 8 to 30 pages | SEO | P2 | parked | Wait for Tier-1 indexing signals |
| 8 | Add 50 additional free tools | New product surface | P3 | parked | Freeze violation — defer |
| 9 | Add 25 additional premium analyzers | New product surface | P3 | parked | Freeze violation — defer |
| 10 | Improve TR localization after EN traffic baseline | Localization | P2 | needs_data | After EN calculate baseline |
| 11 | Add country-specific currency/unit presets | Localization | P2 | needs_data | After top-country traffic known |
| 12 | Add saved report dashboard | New product surface | P2 | parked | Until paid users exist |
| 13 | Add admin event dashboard with real analytics storage | Analytics | P1 | candidate | If external analytics not wired |
| 14 | Add comparison pages: SectorCalc vs Excel | SEO / Conversion | P2 | needs_data | GSC query evidence required |
| 15 | Add comparison pages: SectorCalc vs ERP | SEO / Conversion | P2 | needs_data | GSC query evidence required |
| 16 | Add calculator embed/share widgets | Growth / Product | P2 | needs_data | Distribution hypothesis only |
| 17 | Add email capture on high-intent premium pages | Revenue | P1 | needs_data | After premium unlock signal |
| 18 | Add report sample gallery | Premium report value | P1 | needs_data | Improves locked-state value |
| 19 | Add onboarding checklist for Pro users | Retention | P2 | parked | Until paid Pro users exist |
| 20 | Add sector benchmark database v1 | Data / Product | P2 | parked | Until beta benchmark data approved |

---

## Item detail (seed)

### 1. Complete Stripe webhook production verification

- **Category:** Payment / entitlement
- **Priority:** P0
- **Status:** candidate
- **Problem:** Entitlements must persist server-side after checkout; production webhook must be verified end-to-end.
- **Evidence:** Stripe CLI / live checkout test; `premiumEntitlements` Firestore write
- **Blocker:** yes — revenue correctness

### 2. Add real event storage if analytics no-op remains

- **Category:** Conversion / Analytics
- **Priority:** P0/P1
- **Status:** needs_data
- **Problem:** `loadLiveKpiEvents()` returns empty — admin KPI and sprint decisions lack data.
- **Evidence:** `/admin/kpi` empty state; `trackRevenueEvent` no-op

### 3. Improve top 5 free tool premium CTA based on events

- **Category:** Conversion UX
- **Priority:** P1
- **Status:** needs_data
- **Problem:** Free→premium click rate may be bottleneck.
- **Evidence:** Live KPI verdict `needs_premium_value`; top free tool slugs from KPI

### 4. Strengthen premium report preview if unlock low

- **Category:** Premium report value
- **Priority:** P1
- **Status:** needs_data
- **Problem:** Users preview but do not unlock.
- **Evidence:** `premium_unlock_click` vs `premium_analyzer_open`

### 5. Add single report checkout offer to premium locked state

- **Category:** Revenue
- **Priority:** P1
- **Status:** needs_data
- **Problem:** Pricing intent without clear single-report path.
- **Evidence:** `pricing_view`, `view_pricing_from_locked_report`

### 6. Create first beta partner proof page

- **Category:** Beta partner proof
- **Priority:** P1
- **Status:** needs_data
- **Problem:** Social proof before scaling paid ads.
- **Evidence:** Approved `betaPartners` submission with permission

### 7–20

See table above. Items 7–9, 12, 19–20 are **parked** by freeze or dependency. Items 3–6, 10–11, 14–18 require **evidence** before sprint.

---

## Adding new items

1. Copy [Growth Backlog Intake Form](./growth-backlog-intake-form.md)
2. Score the item
3. Append row to table
4. Do **not** implement in Cursor until sprint selection rules pass
