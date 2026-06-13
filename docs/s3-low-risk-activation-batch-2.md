# S3 Low-Risk Activation Batch 2

Generated: 2026-06-13T22:58:55.125Z

## Summary

- Batch: `S3_lowRiskActivationBatch2`
- S3 batch total: 22
- S2 remainder: No safe S2 remainder candidates
- Merged S2 remainder count: 0
- Processed: 22
- Patched: 22
- Skipped: 0

## Patched slugs

- `warehouse-space-cost-leak` — guide_scaffold, i18n_guide_keys
- `auto-shop-margin-leak-detector` — guide_scaffold, i18n_guide_keys, smoke_oracle
- `cabinet-cost-estimator` — smoke_oracle
- `cleaning-cost-calculator` — smoke_oracle
- `crop-yield-loss-analyzer` — guide_scaffold, i18n_guide_keys, smoke_oracle
- `dairy-profit-detector` — guide_scaffold, i18n_guide_keys, smoke_oracle
- `landscaping-contract-profit-tool` — guide_scaffold, i18n_guide_keys, smoke_oracle
- `lawn-care-cost-check` — smoke_oracle
- `meal-planning-verdict` — guide_scaffold, i18n_guide_keys, smoke_oracle
- `menu-profit-leak-detector` — guide_scaffold, i18n_guide_keys, smoke_oracle
- `millwork-bid-risk-analyzer` — guide_scaffold, i18n_guide_keys, smoke_oracle
- `office-cleaning-bid-optimizer` — smoke_oracle
- `painting-job-profit-verdict` — guide_scaffold, i18n_guide_keys, smoke_oracle
- `panel-shop-margin-verdict` — guide_scaffold, i18n_guide_keys, smoke_oracle
- `plumbing-job-margin-verdict` — guide_scaffold, i18n_guide_keys, smoke_oracle
- `print-job-cost-check` — smoke_oracle
- `product-margin-calculator` — smoke_oracle
- `project-cost-calculator` — smoke_oracle
- `recipe-cost-check` — smoke_oracle
- `roofing-contract-margin-guard` — guide_scaffold, i18n_guide_keys, smoke_oracle
- `roofing-square-cost-check` — smoke_oracle
- `welding-bid-risk-analyzer` — guide_scaffold, i18n_guide_keys, smoke_oracle

## Skipped slugs

- none

## Missing core

- none

## Manual review

- none

## High risk skipped

- none

## Unknown pattern skipped

- none

## Applied scaffold types

- `guide_scaffold` — schema-derived input guide specs
- `smoke_oracle` — vitest smoke tests (no accuracy claims)
- `i18n_guide_keys` — TR/EN title keys under `inputGuide.s3Activation.tools`

## Files touched

- `messages/en.json`
- `messages/tr.json`
- `src/lib/premium-schema/__tests__/s3-low-risk-activation-smoke.test.ts`
- `src/lib/tool-guides/premium-input-guide-specs.ts`
- `src/lib/tool-guides/s3-low-risk-activation-guide-specs.ts`

## Revenue / payment / formula gate safety

- paymentEligible: 22 → 22
- formulaGateEligible: 22 → 22
- free paymentEligible: 0
- problem slug locked: true

## S4 handoff candidates

- none

## Rollback

```bash
git restore src/lib/tool-guides/s3-low-risk-activation-guide-specs.ts \
  src/lib/tool-guides/premium-input-guide-specs.ts \
  src/lib/premium-schema/__tests__/s3-low-risk-activation-smoke.test.ts \
  messages/en.json messages/tr.json \
  docs/s3-low-risk-activation-batch-2.md \
  scripts/tool-activation/apply-s3-low-risk-activation-batch.mjs \
  package.json
```
