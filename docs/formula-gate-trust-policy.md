# Formula Gate Trust Policy

## What Formula Gate is

Formula Gate means the **live calculation surface** a user sees is:

- Routed and active
- Renderable with meaningful inputs (≥ 2 required fields)
- Locale-consistent (no mixed TR/EN labels on TR pages)
- Backed by a FormulaContract and validation path
- Able to submit and render a deterministic result
- Aligned with tier copy (premium routes do not show “free calculator” FAQ)
- P2.4 audit verdict **PASS**

The **Formula Gate Approved** badge (`Formula Gate Onaylı` / `Formula Gate Approved`) is shown only when `runtimeReadiness.formulaGateEligible === true`.

## What Formula Gate is not

- Not “a formula exists in a contract file”
- Not “quality-scan once passed in a registry”
- Not “DeepSeek / AI audit succeeded”
- Not “oracle tests exist but UI is broken”

## Badge eligibility rules

Minimum requirements (`src/lib/tools/runtime-readiness.ts`):

1. Active route
2. Form schema with ≥ 2 required inputs
3. No generic labels (`value`, `amount`, `input`, …) or generic units
4. No mixed-language labels for active locale
5. FormulaContract present
6. Validation / safe calculator path present
7. Submit handler + result renderer present
8. Premium surface must not use free-tier FAQ copy
9. P2.4 verdict must be **PASS** (WARN / FAIL / QUARANTINE → badge hidden)

When not eligible, UI shows **Calculation under review** (`Hesaplama gözden geçiriliyor`) or safe review state.

## DeepSeek / AI role

- **Allowed:** offline audit/repair suggestions, backlog prioritization
- **Forbidden:** live form render dependency, live badge dependency, production badge without deterministic tests
- AI timeout/failure must never produce empty pages or auto-enable badges

## Runtime readiness gate

- Library: `src/lib/tools/runtime-readiness.ts`
- Audit: `node scripts/tool-activation/audit-runtime-tool-readiness.mjs`
- P2.4 cache: `src/lib/tools/runtime-readiness-p24-verdicts.ts` (regenerated from P2.4 report)

## Safe review state

When `status !== ready` or `paymentEligible === false` on premium routes:

- Route stays **200** (not 404, not removed from catalog)
- Full calculation form hidden
- User message: quality review / calculation temporarily disabled
- Feedback CTA + link to other premium tools
- Credit consume / payment actions blocked

## Payment eligibility rule

`paymentEligible === formulaGateEligible && status === ready`

No credit consumption or premium payment CTA when readiness fails.
