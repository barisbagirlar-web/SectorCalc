# SEO MASTER MANDATE V6 — SectorCalc Errata

## E-SC-01 — Firebase Hosting deployment target

[Certain] SectorCalc production hosting is Firebase Hosting. The generic V6 `deployment.target` enum does not include Firebase Hosting.

Permanent resolution for the SectorCalc profile: add `firebase_hosting` as an allowed deployment target when the V6 config layer is installed. This narrows configuration to the actual runtime and does not weaken redirect/header controls.

## E-SC-02 — Monetary representation boundary

[Certain] SectorCalc repository policy requires monetary amounts persisted in JSON to be decimal strings and forbids JavaScript `Number` for money. V6 requires integer minor units in JSON.

Permanent resolution for the SectorCalc profile: computational and decision logic must use integer minor units or Decimal.js internally, but persisted SectorCalc JSON monetary fields remain canonical decimal strings. Serialization/deserialization must be lossless and conformance tests must reject floating-point money. This preserves V6's no-float objective while respecting the repository's stronger money boundary.

## E-SC-03 — JSON Schema dialect

[Certain] SectorCalc repository policy permits JSON Schema Draft 2020-12 only. V6 example schema is Draft-07.

Permanent resolution for the SectorCalc profile: port the V6 config schema semantics to Draft 2020-12 without weakening required fields, enums or validation constraints.

## E-SC-04 — Secret guard log disclosure

[Certain] The historical Paddle production guard used line-producing `git grep`, so a future secret violation could copy the secret into CI logs.

Permanent resolution: secret scans return only detector class and/or filename; matched values must never be printed. Negative tests must assert non-disclosure.

## E-SC-05 — Provider credential exposure

[Certain] A historical public PR description exposed live Paddle server credentials. Visible text was redacted on 2026-08-09, but provider rotation remains mandatory under AIP-13. Tracking: issue #260.

## E-SC-06 — PROGRESS manifest omission

[Certain] V6 X.6 requires `docs/seo/PROGRESS.md`, while X.2 does not list that path in the allowed manifest.

Permanent resolution: the bootstrap contract explicitly adds `docs/seo/PROGRESS.md` as an execution-control artifact. It is non-runtime and may only record phase state/evidence.

## E-SC-07 — Security prerequisite manifest exception

[Certain] AIP-13 requires immediate containment when a secret leak is found, while X.2 does not list the pre-existing production guard file `scripts/verify-paddle-production-guard.mjs` or a public-text secret scanner path.

Permanent resolution: security containment is treated as a higher-priority prerequisite branch under AIP-21. The branch is restricted to guard/test/CI changes plus the allowed SEO record files; no SEO runtime surface is modified. Normal phase scope resumes only after the security gate is cleared.

## E-SC-08 — X.2 omits required X.3/X.4 machine artifacts

[Certain] V6 X.3 requires `seo.config.schema.json` and X.4 requires `PHASE_CONTRACTS.json`, but X.2 does not enumerate either artifact.

Permanent resolution: bootstrap may create `seo.config.schema.json` and `data/seo/PHASE_CONTRACTS.json` because they are required by the higher-specificity machine execution package. They become read-only contract inputs for normal phases except through an explicit contract-maintenance PR.

## E-SC-09 — Exact source document is external to repository transport

[Certain] The authoritative V6 source was supplied through the project File Library. The connected repository tool cannot export that source file byte-for-byte into GitHub.

Permanent resolution: `docs/seo/MANDATE.md` is a binding SectorCalc adapter that identifies the authoritative V6 source and records only source-supported execution rules plus explicit SectorCalc errata. It must never be presented as a byte-identical replacement for the uploaded mandate.
