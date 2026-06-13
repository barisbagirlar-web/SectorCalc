# Runtime Trust Engine (ERT)

SectorCalc **Enterprise Runtime Trust Engine** decides whether a calculator surface is safe to show as approved, accept payment, and run full calculation — based on deterministic registry data, live-surface quality, and P2.4 audit verdicts.

## What Runtime Trust Engine is

A **central decision motor** that returns `RuntimeTrustDecision` for each tool slug:

| Field | Meaning |
|-------|---------|
| `status` | `ready` · `review` · `blocked` |
| `formulaGateEligible` | May show **Formula Gate Approved** badge |
| `paymentEligible` | May show checkout / credit consume |
| `calculationEligible` | May render full calculation form + submit |
| `findings` | Machine-readable blockers |
| `recommendedAction` | `allow` · `safe_review` · `block_payment` · `manual_review` |

Implementation: `src/lib/tools/runtime-trust-engine.ts`

## Formula Gate — what it means

**Formula Gate Approved** (`Formula Gate Onaylı`) means:

- Active route exists
- Renderable form schema (≥ 2 required inputs)
- No generic or mixed-locale labels
- FormulaContract + validation path present
- Submit + result renderer present
- Premium surface uses premium copy (not free FAQ)
- P2.4 verdict explicitly **PASS** (`P24_EXPLICIT_PASS_SLUGS`)
- Formula source audit registry entry exists
- Runtime health store not in `review` / `blocked`

## Formula Gate — what it is NOT

- Not “contract file exists”
- Not “P2.4 WARN with broken UI”
- Not “DeepSeek said OK”
- Not “oracle tests exist but form is broken”

Non-ready tools show **Calculation under review** (`Hesaplama gözden geçiriliyor`) — never “Onaylı”.

## READY / REVIEW / BLOCKED

| Status | Badge | Payment | Calculation |
|--------|-------|---------|-------------|
| **ready** + no findings | Approved if registry + P2.4 PASS | Allowed | Allowed |
| **review** | Review label only | Blocked | Blocked (safe state) |
| **blocked** | Review label only | Blocked | Blocked (safe state) |

## Payment eligibility rule

Premium checkout, credit consume, and full run occur **only when** `decision.paymentEligible === true`.

When false:

- `consumePremiumCredit` must not run
- Checkout CTA disabled
- `ToolSafeReviewState` shown instead of form

## Safe review state

Component: `src/components/tools/ToolSafeReviewState.tsx`

- Route stays **200** (not 404)
- Tool stays in catalog
- User sees quality-review message + premium catalog CTA + feedback button
- Findings hidden in production; dev may show debug list

## Runtime Health Store

File: `src/lib/tools/runtime-health-store.ts`

Types for future Firestore / crawler integration:

- `readRuntimeToolHealth(slug)`
- `mergeRuntimeHealthWithDecision(decision, healthRecord)`

**Rule:** If health store says `review` or `blocked`, final decision is forced safe even if local evaluation says ready.

ERT-0: in-memory only. Firestore writes → ERT-2.

## ERT-1 — Revenue recovery calibration

Module: `src/lib/tools/runtime-trust-eligibility-calibration.ts`

| Rule | Behavior |
|------|----------|
| Free tier | `calculationEligible` when readiness `ready`; **never** `paymentEligible` or Formula Gate |
| Premium / premium-schema | Full trust policy when P2.4 **PASS** + readiness `ready` |
| P2.4 WARN / FAIL / QUARANTINE | No payment (strict) |
| Funnel premium routes | `lawn-care-cost-check`, `print-job-cost-check` resolve validation/renderer via `getRevenueToolByPremiumRouteSlug` |
| Full-loop free tools | Result renderer + validation via `FREE_FULL_LOOP_RUNTIME_SLUGS` |
| P2.4 verdict merge | Worst verdict wins when duplicate slug rows exist (legacy + premium-schema) |

Re-run after calibration:

```bash
node scripts/tool-activation/audit-p24-tool-quality.mjs
node scripts/tool-activation/audit-runtime-trust-engine.mjs
```

P9 gate: ≥10 premium routes with `paymentEligible=true` requires P2.4 **PASS** on premium-schema rows (locale/scenario WARN cleanup) — not WARN bypass.

## Live crawler

Script: `node scripts/smoke-live-premium-tools.mjs`

- Fetches live premium routes (HTML)
- Checks safe state vs broken form
- Detects mixed labels, free FAQ on premium, payment CTA + safe state conflict
- Output: `scripts/.cache/live-premium-smoke-report.json`

## Notification layer

Script: `node scripts/notify-runtime-trust-issues.mjs`

- Reads trust audit report
- Optional Brevo email (`BREVO_API_KEY`, `RUNTIME_ALERT_EMAIL_*`)
- Optional Slack (`SLACK_WEBHOOK_URL`)
- No secrets logged; missing env → terminal summary only

## DeepSeek repair suggestion role

Script: `node scripts/suggest-runtime-repair-with-deepseek.mjs`

- **Allowed:** offline suggestions (root cause, files, label fixes)
- **Forbidden:** auto patch, auto commit, live badge, live form render
- Output: `scripts/.cache/deepseek-repair-suggestions.json`
- Human approval required before any code change

## Human approval policy

1. Trust engine / audit flags issue
2. DeepSeek may suggest repair (optional)
3. Engineer reviews + applies patch
4. P2.4 + runtime trust audit re-run
5. Only then may tool become `ready`

## Automatic quarantine ≠ catalog delete

Tools in `review` / `blocked` remain routed and listed. Full calculation and payment are disabled; trust badge hidden.

## Rollback policy (future)

Health store + deploy gate may pin last-known-good decision per slug. Documented for ERT-2; not active in ERT-0.

## Audit

```bash
node scripts/tool-activation/audit-runtime-trust-engine.mjs
```

Report: `scripts/.cache/runtime-trust-engine-report.json`

Regenerates `src/lib/tools/runtime-readiness-p24-verdicts.ts` from P2.4 cache.

## Problem slug fixture

`abonelik-yazilim-cloud-yillik-maliyet-hesabi` — regression fixture; must stay non-ready until P2.4 PASS + label/copy fixes.
