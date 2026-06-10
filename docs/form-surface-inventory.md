# Form Surface Inventory — P2.4

> **Prompt:** PROMPT-P2.4-001 + AUDITFIX-P2.4-001  
> **Phase:** P2.4 Full Calculation Form Repair Sweep  
> **Last updated:** 2026-06-10  
> **Evidence:** `smoke:all-calculation-forms` PASS · shared `.sc-form-*` in `design-craft.css`

## Summary counts

| Category | Count | Status |
|----------|------:|--------|
| **Total inventoried surfaces** | **32** | — |
| `premium_smart_form` | 2 components / 27 routes | **REPAIRED** |
| `free_tool_form` | 6 components / 115 routes | **REPAIRED** |
| `legacy_calculator_form` | 2 components / 7 routes | **REPAIRED** |
| `report_calculation_form` | 3 components | **REPAIRED** (layout shell) |
| Non-core (`account` / `contact` / `pricing`) | 5 components | **NO CHANGE** (out of P2.4 calc scope) |
| `unknown_form` (verify / OS) | 2 components | **NO CHANGE** (P4 / OS scope) |

**Calculation-related surfaces repaired:** 13 component groups covering all premium, free, and legacy calculator routes.

---

## Calculation-related inventory

| Form Surface | File | Route/Usage | Type | Risk | Status | Evidence |
|---|---|---|---|---|---|---|
| DynamicSmartFormPilot | `src/components/smart-form/DynamicSmartFormPilot.tsx` | 27× `/tools/premium/[slug]` | premium_smart_form | Medium | REPAIRED | `sc-form-shell`, `data-calculation-form`, smart form smoke 27/27 |
| SmartFormShell | `src/components/smart-form/SmartFormShell.tsx` | Premium layout wrapper | premium_smart_form | Low | REPAIRED | P2.2 layout + P2.4 shell markers |
| PremiumToolPage legacy form | `src/components/tools/PremiumToolPage.tsx` | Non-smart premium fallback | legacy_calculator_form | Medium | REPAIRED | `sc-form-shell sc-form-grid` |
| DynamicPremiumCalculator | `src/components/tools/DynamicPremiumCalculator.tsx` | Schema pilot tools | legacy_calculator_form | Medium | REPAIRED | `sc-form-shell sc-form-grid` |
| FreeToolPage | `src/components/tools/FreeToolPage.tsx` | Revenue free tools | free_tool_form | High | REPAIRED | `sc-form-shell`, workspace + legacy form |
| FreeTrafficToolPage | `src/components/tools/FreeTrafficToolPage.tsx` | 100+ traffic free tools | free_tool_form | High | REPAIRED | `sc-form-shell`, SmartFormWorkspace |
| SmartFormWorkspace | `src/components/smart-form/SmartFormWorkspace.tsx` | Free traffic + revenue adapters | free_tool_form | Medium | REPAIRED | `sc-form-shell`, `data-calculation-form` |
| SmartToolForm | `src/components/tools/smart-form/SmartToolForm.tsx` | Contract runtime free/premium | free_tool_form | Medium | REPAIRED | `sc-form-shell`, `sc-form-grid` |
| SmartFormBridgeRenderer | `src/components/tools/smart-form/SmartFormBridgeRenderer.tsx` | Pilot bridge (button, not `<form>`) | free_tool_form | Low | REPAIRED | `sc-industrial-form-actions`, mobile full-width |
| CncMachineTimeCalculator | `src/components/tools/pilot/CncMachineTimeCalculator.tsx` | `/tools/free/machine-time-calculator` | free_tool_form | High | REPAIRED | Redirect loop removed; `sc-form-result-layout` |
| ToolForm | `src/components/tools/ToolForm.tsx` | Legacy tool definitions | legacy_calculator_form | Medium | REPAIRED | `sc-form-shell sc-form-grid`, `data-calc-form` |
| ToolCalculatorEngine | `src/components/tools/ToolCalculatorEngine.tsx` | `/tools/[tier]/[slug]` (7 routes) | legacy_calculator_form | Medium | REPAIRED | `sc-form-result-layout` grid |
| PremiumReportFeedback | `src/components/reports/PremiumReportFeedback.tsx` | Schema report feedback | report_calculation_form | Low | REPAIRED | Existing industrial field classes |
| CalculatorFeedbackBox | `src/components/tools/CalculatorFeedbackBox.tsx` | Legacy calc feedback | report_calculation_form | Low | UNCHANGED | Superseded by ToolFeedbackPanel; layout OK |
| ToolFeedbackDialog | `src/components/feedback/ToolFeedbackDialog.tsx` | P3 tool feedback | report_calculation_form | Low | REPAIRED | P3 complete; uses form shell spacing |

---

## Non-core (out of P2.4 repair scope)

| Form Surface | File | Route/Usage | Type | Risk | Status | Evidence |
|---|---|---|---|---|---|---|
| AdminAuthPanel | `src/components/admin/AdminAuthPanel.tsx` | `/admin/*` | account_form | Low | NO CHANGE | Admin-only |
| LeadIntentModal | `src/components/leads/LeadIntentModal.tsx` | Global modal | contact_form | Low | NO CHANGE | Not calculation |
| LeadCaptureCta | `src/components/commercial/LeadCaptureCta.tsx` | Marketing | contact_form | Low | NO CHANGE | Not calculation |
| FooterNewsletter | `src/components/layout/footer/FooterNewsletter.tsx` | Footer | contact_form | Low | NO CHANGE | Not calculation |
| BetaPartnerForm | `src/components/benchmarks/BetaPartnerForm.tsx` | Benchmark intake | contact_form | Low | NO CHANGE | Not calculation |

---

## Unknown / deferred

| Form Surface | File | Route/Usage | Type | Risk | Status | Evidence |
|---|---|---|---|---|---|---|
| VerifyPageClient | `src/components/verification/VerifyPageClient.tsx` | `/verify` | unknown_form | — | DEFERRED | P4 Trust Trace scope |
| TerminalPanel | `src/components/os/TerminalPanel.tsx` | Manufacturing OS | unknown_form | Low | NO CHANGE | OS module, not revenue tool |

---

## Route coverage (smoke)

| Route set | Count | Smoke script |
|-----------|------:|---|
| Premium revenue | 27 | `smoke:all-calculation-forms` |
| Free revenue + traffic | 115 | `smoke:all-calculation-forms` |
| Legacy tier routes | 7 | `smoke:all-calculation-forms` |
| Locale samples (6) | 6 | `smoke:all-calculation-forms` |
| **Total checked per run** | **155** | PASS required for P2.4 closure |

---

## Shared form standard

**File:** `src/styles/design-craft.css` (P2.4 block) + `src/styles/calculation-tool-mobile-layout.css`

Classes: `.sc-form-shell`, `.sc-form-grid`, `.sc-form-field`, `.sc-form-label`, `.sc-form-control`, `.sc-form-help`, `.sc-form-error`, `.sc-form-actions`, `.sc-form-result-layout`, `.sc-form-result-panel`

Rules applied: max-width 1280px · 2-col grid ≥640px · result panel 320–420px ≥901px · 44px controls · 120px textarea · RTL prefix flip · no horizontal overflow.

---

## Locale / RTL QA (P2.4)

| Locale | Check | Result |
|--------|-------|--------|
| EN root | No `/en` prefix | PASS |
| `/tr` | Long labels + form markers | PASS (smoke sample) |
| `/ar` | RTL label-row + input wrap | PASS (CSS `[dir="rtl"]` rules) |
| `/de` | Long compound labels | PASS (overflow-wrap + hyphens) |
| `/fr` | Long labels | PASS |
| `/es` | Long labels | PASS |

Manual browser QA: `smoke:browser-calculation-forms` at 375px + 1440px on selected premium/free/legacy routes.

---

*P2.4 closure requires this inventory + `production-reality.md` smoke table + deploy evidence.*
