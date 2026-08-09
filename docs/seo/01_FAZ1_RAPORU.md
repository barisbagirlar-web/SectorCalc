# SEO V3 — Phase 1 Registry Report

## Result

- Existing registry SSOT preserved: `seo/registry.mjs` / `seo/registry-data.mjs`.
- V3 contract types added at `src/seo/types.ts` without creating a second registry.
- V3 runtime adapter/validator added at `scripts/validate-registry.ts`.
- The adapter validates route shape, canonical shape, index/noindex semantics, metadata, source references, rich-result type presence and evidence-backed `modifiedAt` values.
- Future `modifiedAt` is a hard failure.
- A noindex route appearing in the sitemap is a hard failure.
- Existing registry invariants are executed before V3 adaptation, so V3 cannot bypass SectorCalc's canonical/query-owner/indexability SSOT.
- Negative tests are in `tests/conformance/v3-registry-contract.test.ts`.

## Validation technology boundary

The V3 mandate names Zod. SectorCalc's established machine-contract stack is AJV with JSON Schema Draft 2020-12 and contains no Zod dependency. To avoid parallel validation engines and dependency drift, the exact V3 field/negative-test semantics are implemented using the existing AJV 2020-12 stack. This compatibility decision is recorded as `E-SC-10` in `docs/seo/MANDATE_ERRATA.md`.

## Coverage

- Current authoritative indexable baseline: 90 URLs.
- Current published calculator baseline: 25 calculators.
- Validation operates over every current `PAGES` registry record at runtime; it is not limited to a sampled percentage.
- Known evidence-model differences are recorded in `docs/seo/EKSIK_REGISTRY_ALANLARI.md`; no placeholder content is inserted.

## Build / CI integration

The V3 validator is imported by the conformance test suite, therefore any Phase 1 contract violation breaks the existing `seo:conformance` CI gate. The existing V6 `seo:validate-registry` command remains intact so the new adapter cannot weaken the installed V6 execution contract. A consolidated user-facing audit alias will be installed in Phase 10 rather than replacing the V6 command mid-sequence.

## Phase status

Phase 1 is code-complete when the repository's required CI, Canonical Gates, Regression Guard, Sitemap Integrity, Public Secret Guard and SEO V6 Conformance checks are all green for this branch. No public runtime surface is intentionally changed by this phase.
