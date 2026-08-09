# SEO MASTER MANDATE V6 — SectorCalc Binding Adapter

## Authority

The authoritative source is the user-supplied document `SEO_MANDATE_V6_TAM_SURUM.md`, version 6.0 Final / Enterprise Edition. This repository file is a binding execution adapter, not a rewritten or shortened replacement for that source.

Source-derived execution model:
- phase = branch = pull request;
- contract violation blocks merge;
- claims require evidence;
- AIP-01 through AIP-27 are binding;
- the execution package X is machine-enforced before Phase 0;
- profile M applies to SectorCalc as a growing commercial single-site product;
- thresholds are read from `sites/sectorcalc/seo.config.json`;
- human-approval decisions are recorded in `docs/seo/KARAR_DEFTERI.md`;
- contract ambiguities/errors are recorded in `docs/seo/YORUM_KAYDI.md` or `docs/seo/MANDATE_ERRATA.md` rather than guessed.

## SectorCalc-specific binding decisions

1. Canonical production origin is `https://sectorcalc.com`.
2. Production hosting is Firebase Hosting; the V6 deployment enum is extended only by the recorded SectorCalc erratum.
3. Repository JSON Schema dialect remains Draft 2020-12; V6 semantics are ported without weakening required validation.
4. Money computation uses integer minor units or Decimal.js; existing persisted SectorCalc JSON money boundaries remain lossless decimal strings where repository policy requires them.
5. Existing `seo/registry.mjs` and `seo/indexability.mjs` are preserved as the production SEO state authority until Phase 1 explicitly adapts them.
6. Existing canonical, sitemap, regression, secret and deployment guards remain active; V6 adds controls and does not remove stronger existing controls.
7. No measured traffic, conversion, revenue, LTV or valuation value may be invented. Missing analytics data is recorded as partial/low-confidence evidence.
8. Phase 18 is not applicable under profile M. Phase 8, 16 and 19 are executed when their evidence gates are available because they materially support crawl/AI, growth-loop and valuation objectives.

## Precedence

Legal/ethical restrictions remain first. For repository execution, current explicit user instruction, AIP rules, site config, phase body, then examples are applied in that order. A more restrictive existing production safety rule is preserved unless an explicit, recorded decision changes it.

## Machine layer

The executable contract is represented by:
- `sites/sectorcalc/seo.config.json`
- `seo.config.schema.json`
- `data/seo/PHASE_CONTRACTS.json`
- `data/seo/invariants.json`
- `scripts/seo/preflight.ts`
- `tests/conformance/**`
- `.github/workflows/seo-conformance.yml`
- `docs/seo/PROGRESS.md`

Any divergence between this adapter and the authoritative uploaded V6 source must be treated as an erratum and resolved toward the stricter interpretation.
