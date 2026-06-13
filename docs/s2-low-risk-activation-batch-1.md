# S2 Low-Risk Activation Batch 1

Generated: 2026-06-13T22:45:22.708Z

## Summary

- Batch: `S2_lowRiskActivationBatch1`
- Input count: 50
- Patched: 3
- Skipped: 47

## Patched slugs

- `3d-print-job-margin-tool` — smoke_oracle
- `7-israf-muda-avcisi-parasal-karsilik-calculator` — smoke_oracle
- `feed-efficiency-analyzer` — smoke_oracle

## Skipped slugs

- `agriculture-irrigation-yield-loss` — no_safe_scaffold_gap
- `annual-leave-severance-notice-calculator` — risk_exclusion:severance
- `auto-repair-comeback-cost` — risk_exclusion:auto-repair
- `auto-repair-parts-labor-quote-calculator` — risk_exclusion:auto-repair
- `belt-pulley-speed-length-calculator` — no_safe_scaffold_gap
- `bolt-tightening-torque-calculator` — risk_exclusion:bolt-tightening
- `calibration-drift-risk` — no_safe_scaffold_gap
- `carbon-footprint-compliance-risk` — risk_exclusion:carbon-footprint-compliance
- `cbam-compliance-verdict` — risk_exclusion:cbam
- `cbam-exposure-quick-check` — risk_exclusion:cbam
- `cbam-unit-product-carbon-footprint-calculator` — risk_exclusion:cbam
- `cloud-api-cost-overrun` — no_safe_scaffold_gap
- `cnc-oee-loss` — no_safe_scaffold_gap
- `cnc-tool-wear-cost` — no_safe_scaffold_gap
- `compressor-leak-cost-calculator` — no_safe_scaffold_gap
- `construction-project-overrun` — no_safe_scaffold_gap
- `construction-subcontractor-margin-leak` — no_safe_scaffold_gap
- `dairy-feed-efficiency-loss` — no_safe_scaffold_gap
- `downtime-minute-cost-calculator` — no_safe_scaffold_gap
- `employee-total-cost-calculator` — no_safe_scaffold_gap
- `energy-peak-cost` — medium_risk_pattern
- `energy-savings-package-calculator` — medium_risk_pattern
- `fire-system-flow-hydrant-calculator` — risk_exclusion:fire-system
- `food-waste-margin-loss` — no_safe_scaffold_gap
- `heat-loss-calculator` — medium_risk_alignment
- `hvac-callback-margin-risk` — medium_risk_pattern
- `hydraulic-pneumatic-cylinder-force-calculator` — risk_exclusion:hydraulic
- `inventory-carrying-cost-eoq-calculator` — no_safe_scaffold_gap
- `investment-payback-npv-calculator` — no_safe_scaffold_gap
- `logistics-fuel-route-drift` — medium_risk_pattern
- `material-waste-calculator` — medium_risk_alignment
- `oee-equipment-effectiveness-calculator` — no_safe_scaffold_gap
- `painting-rework-coverage-risk` — no_safe_scaffold_gap
- `plumbing-leak-callback-cost` — no_safe_scaffold_gap
- `printing-reprint-margin-leak` — no_safe_scaffold_gap
- `product-customer-profitability-calculator` — no_safe_scaffold_gap
- `profit-margin-calculator` — medium_risk_alignment
- `quality-cost-paf-calculator` — no_safe_scaffold_gap
- `quote-price-profit-margin-calculator` — medium_risk_pattern
- `restaurant-menu-margin-leak` — no_safe_scaffold_gap
- `retail-inventory-turnover-risk` — no_safe_scaffold_gap
- `roofing-weather-delay-risk` — no_safe_scaffold_gap
- `scrap-rate-calculator` — medium_risk_alignment
- `sheet-metal-scrap-risk` — no_safe_scaffold_gap
- `shop-rate-hourly-cost-calculator` — no_safe_scaffold_gap
- `textile-fabric-waste-risk` — no_safe_scaffold_gap
- `tolerance-stack-up-calculator` — no_safe_scaffold_gap

## Missing core

- none

## Manual review

- `energy-peak-cost` — medium_risk_pattern
- `energy-savings-package-calculator` — medium_risk_pattern
- `heat-loss-calculator` — medium_risk_alignment
- `hvac-callback-margin-risk` — medium_risk_pattern
- `logistics-fuel-route-drift` — medium_risk_pattern
- `material-waste-calculator` — medium_risk_alignment
- `profit-margin-calculator` — medium_risk_alignment
- `quote-price-profit-margin-calculator` — medium_risk_pattern
- `scrap-rate-calculator` — medium_risk_alignment

## High risk skipped

- `annual-leave-severance-notice-calculator` — risk_exclusion:severance
- `auto-repair-comeback-cost` — risk_exclusion:auto-repair
- `auto-repair-parts-labor-quote-calculator` — risk_exclusion:auto-repair
- `bolt-tightening-torque-calculator` — risk_exclusion:bolt-tightening
- `carbon-footprint-compliance-risk` — risk_exclusion:carbon-footprint-compliance
- `cbam-compliance-verdict` — risk_exclusion:cbam
- `cbam-exposure-quick-check` — risk_exclusion:cbam
- `cbam-unit-product-carbon-footprint-calculator` — risk_exclusion:cbam
- `fire-system-flow-hydrant-calculator` — risk_exclusion:fire-system
- `hydraulic-pneumatic-cylinder-force-calculator` — risk_exclusion:hydraulic

## Unknown pattern skipped

- none

## Patch types applied

- `guide_scaffold` — schema-derived input guide specs
- `smoke_oracle` — vitest smoke tests (no accuracy claims)
- `i18n_guide_keys` — TR/EN title keys under `inputGuide.s2Activation.tools`

## Files touched

- `src/lib/premium-schema/__tests__/s2-low-risk-activation-smoke.test.ts`

## Revenue / payment / formula gate safety

- paymentEligible: 22 → 22
- formulaGateEligible: 22 → 22
- free paymentEligible: 0
- problem slug locked: true

## S3 handoff candidates

- `energy-peak-cost`
- `energy-savings-package-calculator`
- `heat-loss-calculator`
- `hvac-callback-margin-risk`
- `logistics-fuel-route-drift`
- `material-waste-calculator`
- `profit-margin-calculator`
- `quote-price-profit-margin-calculator`
- `scrap-rate-calculator`

## Rollback

```bash
git restore src/lib/tool-guides/s2-low-risk-activation-guide-specs.ts \
  src/lib/tool-guides/premium-input-guide-specs.ts \
  src/lib/premium-schema/__tests__/s2-low-risk-activation-smoke.test.ts \
  messages/en.json messages/tr.json \
  docs/s2-low-risk-activation-batch-1.md \
  scripts/tool-activation/apply-s2-low-risk-activation-batch.mjs \
  package.json
```
