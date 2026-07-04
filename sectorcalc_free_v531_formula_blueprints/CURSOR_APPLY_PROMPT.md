CURSOR TASK -- INTEGRATE FREE V5.3.1 FORMULA BLUEPRINTS AND FIX BROKEN TOOL PAGE TITLES

ROLE:
Act as a staff-level SectorCalc V5.3.1 schema engineer, deterministic formula engineer, UI integration owner, and release gate owner.

SOURCE PACKAGE:
sectorcalc_free_v531_formula_blueprints

OBJECTIVE:
Integrate the provided Free tool formula blueprints into the SectorCalc website without breaking the existing UniversalIndustrialDecisionForm V5.3.1 design.

CRITICAL UI DEFECT TO FIX:
Current tool pages show raw slug-like titles and mixed route labels. The page header must not display raw slugs such as thin-walled-pressure-vessel-hoop-stress-calculator. It must display schema.tool_name such as Thin Walled Pressure Vessel Hoop Stress Calculator.

Required header binding:
- H1: schema.tool_name
- Tool key chip: schema.tool_key only if explicitly shown as technical metadata
- Category: schema.category
- Scope: schema.scope
- Do not compose visible titles from route slug.
- Do not mix categorySlug, sectorSlug, and tool slug in the same form header.
- On identity mismatch, block render and show a schema identity error.

FORMULA INTEGRATION:
- Place formula modules under a server-only runtime path.
- Add import "server-only" to formula modules.
- Use normalized base-unit inputs only.
- Return deterministic numeric outputs with finite checks.
- Never use eval or new Function.
- Never use runtime LLM.
- Never import private formula modules into client components.
- Never expose exact formulas in public UI, public schema, public JSON, PDF, copy summary, or browser state.

SCHEMA CONTRACT:
Every tool must have:
- form_runtime_binding.execute_response_contract.redaction_status
- audit_trail_contract.seal_fields including redaction_status
- ui_contract.target_renderer = UniversalIndustrialDecisionForm
- normalized_inputs aligned with formula inputs
- outputs aligned with formula outputs
- validation_contract with denominator and finite-output blockers

PAGE AND ROUTE FIX:
- /free-tools must list tools with human-readable schema.tool_name.
- Detail pages must resolve by root-only slug/tool_key.
- Detail pages must pass route toolKey into UniversalIndustrialDecisionForm.
- The form must assert routeToolKey equals schema.tool_key.
- The form must not render if schema identity does not match.
- Unknown slugs must return safe notFound.
- /en and /tr must remain 404.

CSS AND LAYOUT:
- Do not change the locked V5.3.1 palette.
- Do not add a new UI system.
- Keep selectors scoped under .sc-v531-shell or .sc-v531-*.
- Fix long title and label overflow using wrapping inside the existing scoped classes only.
- Verify 375px mobile width.
- Buttons must remain visible and clickable.

BUTTON CONTRACT:
Verify for every imported Free tool:
- Calculate works.
- Reset Inputs works.
- Reset Result works.
- Copy Result works.
- Export or PDF works when export_contract enables it.
- Protected methodology panel renders without exact formula leakage.
- Audit seal panel renders.
- REVIEW state renders correctly when the formula module is missing.
- No stale result or stale schema survives tool switches.

ZERO LANGUAGE POLICY:
All schema, UI, metadata, route labels, button labels, export labels, and formula blueprint public-facing content must be pure technical English.
No non-English visible content is allowed.

REQUIRED COMMANDS:
rm -rf .next
npm run guard:zero-turkish
node scripts/audit-new-free-v531-package.mjs
node scripts/audit-v531-schema-quality.mjs
node scripts/guard-public-formula-redaction.mjs
npm run typecheck
npm run lint
npm run build
npm run guard:v531
npm run guard:root-only
node scripts/smoke-new-free-v531-tools.mjs
node scripts/smoke-all-v531-tools.mjs
npm run check:secrets

ACCEPTANCE:
Return PASS only if:
- every formula blueprint is either implemented as server-only formula execution or explicitly REVIEW_MODULE_MISSING
- no fake OK fallback exists
- raw slugs no longer appear as page titles
- page headers use schema.tool_name
- no mixed route/category/tool identity appears
- all Free detail pages render with UniversalIndustrialDecisionForm V5.3.1
- no CSS overflow exists at 375px
- every button contract passes
- zero public formula leakage
- zero non-English public/schema/export text
- /en and /tr stay 404
- build and all guards pass

FINAL REPORT FORMAT:
SECTORCALC_FREE_FORMULA_BLUEPRINTS_AND_PAGE_UI_FIX=PASS|FAIL

RESULT:
- PASS or FAIL

FORMULA_PACKAGE:
- tool count:
- formula blueprints imported:
- server-only modules integrated:
- missing modules:
- fake OK fallback:

BROKEN_PAGE_UI_FIX:
- raw slug title removed:
- schema.tool_name header binding:
- mixed category/tool identity:
- mobile overflow:
- button visibility:

SCHEMA_CONTRACT:
- redaction_status:
- normalized inputs:
- output bindings:
- audit seal:
- public formula redaction:

TESTS:
- guard:zero-turkish:
- package audit:
- schema quality audit:
- formula redaction guard:
- typecheck:
- lint:
- build:
- guard:v531:
- guard:root-only:
- smoke:new-free-v531:
- smoke-all-v531-tools:
- secrets check:

GIT:
- branch:
- commit hash:
- working tree:
- push status:

BLOCKERS:
- NONE or real blocker with file path and reason
