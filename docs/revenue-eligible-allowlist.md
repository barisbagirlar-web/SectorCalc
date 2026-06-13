# Revenue Eligible Allowlist

## Why this exists

SectorCalc revenue surfaces (payment checkout, Formula Gate badge, PDF export gating) must not open automatically when a tool passes audit, guide, schema, oracle, or route checks alone. A single explicit allowlist is the control-plane kill-switch that bounds `paymentEligible` and `formulaGateEligible` in runtime trust audits.

Without this lock, scaffold or activation work can accidentally mark a new premium tool as revenue-ready even when product has not approved payment.

## Approved slugs (22)

| Slug |
|------|
| auto-shop-margin-leak-detector |
| change-order-impact-analyzer |
| cnc-quote-risk-analyzer |
| crop-yield-loss-analyzer |
| dairy-profit-detector |
| hvac-project-margin-guard |
| landscaping-contract-profit-tool |
| lawn-care-cost-check |
| meal-planning-verdict |
| menu-profit-leak-detector |
| millwork-bid-risk-analyzer |
| office-cleaning-bid-optimizer |
| painting-job-profit-verdict |
| panel-shop-margin-verdict |
| plumbing-job-margin-verdict |
| print-job-cost-check |
| return-profit-erosion-tool |
| roofing-contract-margin-guard |
| sheet-metal-quote-risk-tool |
| signage-bid-safe-price-tool |
| water-optimization-verdict |
| welding-bid-risk-analyzer |

Source of truth: `scripts/tool-activation/revenue-eligible-allowlist.mjs`

## S2 incident: feed-efficiency-analyzer

After S2 low-risk activation scaffold, `feed-efficiency-analyzer` briefly appeared as the 23rd `paymentEligible` / `formulaGateEligible` slug. Audit PASS and schema readiness alone must not expand revenue eligibility. The allowlist kill-switch forces that slug (and any future non-approved slug) to `paymentEligible: false` and `formulaGateEligible: false` in audit output.

## Rules

### Manual allowlist update to open payment

To make a new paid tool revenue-eligible:

1. Complete product / trust review for that slug.
2. Add the slug to `REVENUE_ELIGIBLE_ALLOWLIST` in `revenue-eligible-allowlist.mjs`.
3. Update `EXPECTED_REVENUE_ELIGIBLE_COUNTS` if the approved count changes.
4. Re-run `node scripts/tool-activation/audit-runtime-trust-engine.mjs` and `npm run assert:revenue-gate`.

There is no automatic path from audit PASS to payment eligibility.

### Formula Gate does not auto-open

`formulaGateEligible` is capped by the same allowlist. Passing formula source audit, oracle, or P2.4 alone does not enable the Formula Gate badge for production revenue tools.

### Free tier: paymentEligible must stay 0

Free tools never receive `paymentEligible: true` in trust audit output. `assert-revenue-gate` fails if any free-tier item is payment-eligible.

### Problem slug locked

`abonelik-yazilim-cloud-yillik-maliyet-hesabi` remains permanently blocked from payment and Formula Gate eligibility (hard review override + not on allowlist).

## Enforcement

- `scripts/tool-activation/audit-runtime-trust-engine.mjs` — post-audit kill-switch applies allowlist to report items.
- `scripts/tool-activation/assert-revenue-gate.mjs` — exact boundary checks (22 / 22 / 0) and per-slug assertions.
