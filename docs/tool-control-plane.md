# P2.5 Enterprise Control Plane

Read-only aggregation layer for SectorCalc tool quality, formula knowledge graph, and DeepSeek bulk repair context.

## Scripts

| Command | Output | Purpose |
|---------|--------|---------|
| `npm run audit:p25-control-plane` | `scripts/.cache/tool-quality-control-plane.json` | Unified PASS/WARN/FAIL map + eligibility + repair routing |
| `npm run build:formula-knowledge-graph` | `scripts/.cache/formula-knowledge-graph.json` | Tool → route → schema → contract → validation chain |
| `npm run ai:deepseek:export-tool-context` | `scripts/.cache/deepseek/tool-context-for-repair.json` | Redacted DeepSeek repair payload |

## Prerequisites

Run upstream audits first (or let control plane warn on missing sources):

```bash
node scripts/tool-activation/audit-p24-tool-quality.mjs
node scripts/tool-activation/audit-runtime-trust-engine.mjs
```

Optional inputs (findings only, not final authority):

```bash
node scripts/tool-activation/audit-legacy-conflicts.mjs
npm run ai:deepseek:formula-audit
```

## Data sources

- P2.4 tool quality report
- Runtime Trust Engine report
- Revenue gate eligibility (via trust report)
- FormulaContract registry
- Premium-schema registry + validation modules
- Route/catalog (`public/ai-tool-index.json`)
- Locale messages (`messages/*.json`)
- Input guide specs
- Legacy conflict report (findings only)

## Security

- Cache outputs are gitignored (`scripts/.cache/`).
- DeepSeek export applies secret/email redaction before write.
- Forbidden DeepSeek tasks are embedded in export payload:
  - `formula_gate_final_decision`
  - `payment_decision`
  - `deploy_decision`
  - `legal_certification_approval`
  - `untested_auto_patch`

## Final authority

DeepSeek export is **context only**. Final decisions remain:

1. Deterministic audits (P2.4, Runtime Trust, Revenue Gate)
2. Tests (`npm run lint`, `tsc`, `build`, `assert:revenue-gate`)
3. Human approval before patch apply

## Problem slug guard

`abonelik-yazilim-cloud-yillik-maliyet-hesabi` must stay blocked for payment and formula gate eligibility in control plane scoring.
