# SectorCalc Revenue Flow v1A — Product Spec Lock

This document locks the **free calculator / paid analyzer** product matrix before implementation phases (Stripe checkout, PDF export, saved analyses).

## Product model

| Layer | Role | Delivers | Does not deliver |
|-------|------|----------|------------------|
| **Free calculator** | SEO, trust, quick pre-check | Directional numbers, early risk signals, missing-factor hints | Safe price, verdict, full breakdown, PDF, saved analysis |
| **Paid analyzer** | Decision engine (SectorCalc Pro) | Verdict, safe price / minimum bid / leak amount, key drivers, suggested action | Standalone “report product” — PDF is export of paid output only |

## Canonical source

All sector pairs live in `src/lib/tools/revenue-tools.ts` as `REVENUE_TOOL_PRODUCT_SPECS`.

Each entry includes:

- `sector`, `freeSlug`, `paidSlug`, `freeTitle`, `paidTitle`
- `painStatement`, `freeValue`, `paidValue`
- `freeInputs`, `paidInputs` (input field IDs aligned with tool definitions)
- `freeResultPromise`, `paidResultPromise`
- `verdictLabels`, `legalDisclaimer`

Runtime-only fields (`freeResultIds`, `freeMissingFactors`, `premiumCtaLabel`) support the current UI until v1B tightens calculators.

## Five-sector matrix

| Sector | Free calculator | Paid analyzer |
|--------|-----------------|---------------|
| CNC / Manufacturing | Machine Time Calculator | Quote Risk Analyzer |
| Construction | Project Cost Calculator | Change Order Impact Analyzer |
| Cleaning | Cleaning Cost Calculator | Bid Optimizer |
| Restaurant | Food Cost Calculator | Menu Profit Leak Detector |
| E-commerce | Product Margin Calculator | Return Profit Erosion Tool |

## URL strategy

- Free: `/tools/free/{slug}` — “calculator” language OK in titles/URLs.
- Paid: `/tools/premium/{slug}` — CTA copy uses “analyzer”, “verdict”, “safe price”.

## Privacy (free tools)

Inputs are browser-first for the session. Free inputs are not stored unless the user creates an account and explicitly saves an analysis.

## Legal

Default disclaimer on all result screens:

> This is a technical simulation, not financial, legal or engineering advice. Verify before business decisions.

Paid tools append: *Digital product. No refunds.*

## SectorCalc Pro pricing (copy lock)

- **Price:** $29/month
- **Positioning:** Free calculators for quick checks; Pro unlocks analyzers with safe price verdicts, margin leak detection and bid risk decisions.
- **Out of scope for v1A:** Stripe wiring, PDF generation, persisted analyses.

## Extension guide

To add a sector:

1. Add slugs to `ToolSlug` in `src/data/tools.ts`.
2. Add tool definitions under `src/data/tool-definitions/`.
3. Append one object to `REVENUE_TOOL_PRODUCT_SPECS` with all required fields.
4. Register definitions in `src/data/tool-definitions/index.ts`.

No duplicate free→paid mapping elsewhere — derive from the spec registry.
