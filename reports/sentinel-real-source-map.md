# Sentinel Real Source Map — SectorCalc Production Modules

| Layer | Source File | Export Name | Purpose |
|---|---|---|---|
| Manifest | `src/sectorcalc/runtime/active-tool-allowlist.ts` | `ACTIVE_PRO_TOOL_SLUGS` | Canonical 20-tool catalog |
| Schema Loader | `src/sectorcalc/runtime/resolve-approved-tool-schema.ts` | `resolveApprovedToolSchema` | Schema resolution + validation |
| Schema Registry | `src/sectorcalc/pro-form/schema-registry.ts` | `schemaRegistry` | In-memory schema cache |
| Schema Adapter | `src/sectorcalc/pro-form/schema-adapter.ts` | `validateSuperV4Schema` | Schema validation |
| Schema Normalizer | `src/sectorcalc/runtime/pro-schema-loader.ts` | `normalizeProSchema` | Schema normalization |
| Form | `src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx` | (component) | PRO V2 form renderer |
| Form Machine | `src/sectorcalc/pro-form/useUniversalIndustrialDecisionFormMachine.ts` | (hook) | Form state machine |
| Form State | `src/sectorcalc/pro-form/form-state-machine.ts` | `universalFormMachineReducer` | Reducer |
| Payload Adapter | `src/sectorcalc/pro-form/pro-execute-payload-adapter.ts` | `buildExecutePayload`, `getFormToSchemaMap` | Form → API payload |
| Unit Normalizer | `src/sectorcalc/pro-form/unit-normalizer.ts` | `normalizeInputs`, `normalizeInput` | Display → base unit |
| Schema Files | `src/sectorcalc/schemas/pro-v531/*.schema.json` | (JSON) | 20 PRO tool schemas |
| Formula Files | `src/sectorcalc/formulas/pro-v531/*.formula.ts` | `calculate`, `sampleInputs` | 20 formula modules |
| Formula Resolver | `src/sectorcalc/formulas/pro-v531/resolve-formula-module.ts` | `resolveFormulaModule`, `hasFormulaModule` | Static formula module registry |
| Formula Registry | `src/sectorcalc/formulas/pro-v531/baris-formula-registry.ts` | `initBarisFormulaRegistry` | Batch 1+2 registration |
| Formula Contract | `src/sectorcalc/formulas/pro-v531/pro-formula-contract.ts` | `ProFormulaModule` | Formula module type |
| Sample Inputs | `src/sectorcalc/formulas/pro-v531/pro-sample-inputs.ts` | `PRO_SAMPLE_INPUTS` | Deterministic preset values |
| API Route | `src/app/api/pro-calculator/execute/route.ts` | (default handler) | 23-step execute pipeline |
| Report Contract | `src/sectorcalc/pro-report/pro-report-contract-registry.ts` | `proReportContractRegistry` | Tool-specific report registry |
| Report Adapter | `src/sectorcalc/pro-report/pro-report-adapter.ts` | `buildProReport` | Output → report sections |
| Report Panel | `src/sectorcalc/pro-report/ProReportPanelV2.tsx` | `ProReportPanelV2` | Client-side report renderer |
| Report Types | `src/sectorcalc/pro-report/pro-report-types.ts` | (types) | Report contract types |
| Auth Store | `src/lib/features/billing/use-user-subscription.ts` | `useUserSubscription` | Firebase auth + subscription |
| Session Wrapper | `src/sectorcalc/pro-form/ProToolSessionWrapper.tsx` | (component) | Credit session management |
| Entitlement Guard | `src/sectorcalc/pro-commerce/baris-entitlement-guard.ts` | `checkBarisExecutionEntitlement` | Auth + credit check |
| Product Usage | `src/lib/credits/product-usage-policy.ts` | (functions) | Credit ledger operations |
| Build Info | `generated/tool-git-dates.json` | (generated) | Tool deployment metadata |
| Route | `src/app/tools/pro/[slug]/page.tsx` | (default) | PRO tool detail page |
| Paywall Gate | `src/components/pro-commerce/ProToolPaywallGate.tsx` | (component) | Auth gate |
