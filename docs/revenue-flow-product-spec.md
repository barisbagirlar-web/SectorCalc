# SectorCalc Revenue Flow v1A — Product Spec Lock

This document locks the **free calculator / paid analyzer** product matrix before implementation phases (Stripe checkout, PDF export, saved analyses).

## Product model

| Layer | Role | Delivers | Does not deliver |
|-------|------|----------|------------------|
| **Free calculator** | SEO, trust, quick pre-check | Directional numbers, early risk signals, missing-factor hints | Safe price, verdict, full breakdown, PDF, saved analysis |
| **Paid analyzer** | Decision engine (SectorCalc Pro) | Verdict, safe price / minimum bid / leak amount, key drivers, suggested action | Standalone “report product” — PDF is export of paid output only (later phase) |

## Canonical source

| File | Purpose |
|------|---------|
| `src/lib/tools/revenue-tools.ts` | `RevenueToolRegistry`, types, lookup helpers |
| `src/lib/pricing/sectorcalc-pro.ts` | SectorCalc Pro pricing copy lock |

Registry export: `REVENUE_TOOL_REGISTRY` with `tools: RevenueTool[]`.

Each `RevenueTool` includes:

- `sector`, `freeSlug`, `paidSlug`, `freeTitle`, `paidTitle`
- `painStatement`, `freeValue`, `paidValue`
- `freeInputs`, `paidInputs` (`RevenueToolInput[]` — `{ id }` aligned with tool definitions)
- `freeResultPromise`, `paidResultPromise`
- `verdictLabels`, `legalDisclaimer`, `seoKeywords`

Runtime-only fields (`freeResultIds`, `freeMissingFactors`, `premiumCtaLabel`) support existing UI until v1B.

## Five-sector matrix

| Sector | Free calculator | Paid analyzer |
|--------|-----------------|---------------|
| CNC / Manufacturing | Machine Time Calculator | CNC Quote Risk Analyzer |
| Construction | Concrete / Project Cost Calculator | Change Order Impact Analyzer |
| Cleaning | Cleaning Cost Calculator | Office Cleaning Bid Optimizer |
| Restaurant | Food Cost Calculator | Menu Profit Leak Detector |
| E-commerce | Product Margin Calculator | Return Profit Erosion Tool |

## Free vs paid rules

**Free tool**

- SEO + trust + simple pre-check
- Shows basic results
- Does **not** give safe price, minimum bid, verdict, PDF, or saved analysis
- Inputs browser-first; privacy note on free tool pages

**Paid analyzer**

- Decision engine that ends the pain
- Safe price / minimum bid / margin leak / risk verdict
- Report-style structured result (PDF export = later phase)
- Formulas not shown in UI

## Legal disclaimer (locked)

> This is a technical simulation and decision-support output. It is not financial, legal or engineering advice. Verify all results before making business decisions.

## SectorCalc Pro pricing (copy lock)

See `src/lib/pricing/sectorcalc-pro.ts`:

- **Plan:** SectorCalc Pro — $29/month
- **Headline:** Unlock sector-specific decision tools.
- **Out of scope for v1A:** Stripe, webhooks, PDF, new subscription guards, Cloud Functions changes

## Extension guide

To add a sector:

1. Add slugs to `ToolSlug` in `src/data/tools.ts`.
2. Add tool definitions under `src/data/tool-definitions/`.
3. Append one `RevenueTool` to `REVENUE_TOOL_REGISTRY.tools` in `revenue-tools.ts`.
4. Register definitions in `src/data/tool-definitions/index.ts`.

No duplicate free→paid mapping elsewhere — derive from the registry.
